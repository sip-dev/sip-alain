import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { Lib } from 'sip-lib';
import { HttpHeaders } from '@angular/common/http';
import { SipAlainConfig } from '../extends/sip-alain-config';

//#region rest helper

export interface SipHttpOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}

export interface SipRestParam {
    params?: object;
    postType?: '' | 'form' | 'body';
    httpOptions?: SipHttpOptions;
    /**拥有者，一般是UI，处理释放问题 */
    owner?: any;
    /**是否缓存，必须设置owner */
    cache?: boolean;
}

export interface SipRestRet<T=any> {
    isSucc: boolean;
    status: number;
    statusText?: string;
    datas: T;
    error?: string;
    message?: string;
}

/**
 * 生成rest返回数据
 * @param rs 
 */
function mapData(rs: any): SipRestRet {

    return {
        isSucc: rs.returnCode == 200,
        status: rs.returnCode,
        statusText: 'Ok',
        datas: rs.returnValue,
        error: rs.error,
        message: rs.returnDesc
    };
};

//#endregion rest helper


//#region sql helper

export interface SipSqlParam extends SipRestParam {
    url?: string;
    connstr?: string;
    sqlId?: string;
    pageSize?: number;
    pageIndex?: number;
    sortName?: string;
    sortOrder?: '' | 'asc' | 'desc';
    searchparam?: object;
}

export interface SipRestSqlRet<T=any> extends SipRestRet<T> {
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    total: number;
}
/**
 * 生成sql rest返回数据
 * @param data mapData返回的数据
 */
function mapSqlData(data: any): SipRestSqlRet {
    let sqlData = data.datas;
    let retData: any = Lib.extend(data, {
        pageIndex: sqlData ? sqlData.PageIndex : 0,
        pageSize: sqlData ? sqlData.PageSize : 10,
        totalPages: sqlData ? sqlData.TotalPages : 0,
        total: sqlData ? sqlData.TotalRecords : 0
    });
    retData.datas = sqlData ? sqlData.Data : [];
    return retData as SipRestSqlRet;
};

export interface ISipRestDict {
    "code": string,
    "text": string,
    "status": string,
    "description": string
}

//#endregion sql helper

@Injectable()
export class SipRestService {

    constructor(private config: SipAlainConfig,
        private http: HttpClient) { }

    /**
     * 获取url部分，去除query部分
     * @param url 
     */
    parseUrl(url: string): string {
        return url ? url.split('?')[0] : '';
    }

    /**
     * 将url query部分转为Object形式
     * @param url 
     */
    queryToObject(url: string): object {
        let obj = {};
        let query = url ? url.split('?')[1] : '';
        if (query) {
            query.split('&').forEach(item => {
                let qItems = item ? item.split('=') : null;
                if (qItems) obj[qItems[0]] = decodeURIComponent(qItems[0] || '');
            });
        }
        return obj;
    }

    /**
     * 生成url request参数
     * @param params 
     */
    queryString(url: string, params: object): string {
        if (params) {
            let ret = new HttpParams();
            let querys = this.queryToObject(url);
            url = this.parseUrl(url);
            Lib.eachProp(Lib.extend(querys, params), (item, key) => {
                if (!Lib.isUndefined(item))
                    ret = ret.set(key, Lib.isObject(item) ? JSON.stringify(item) : item);
            });
            return url + '?' + ret.toString();
        }
        return url;
    }
    /**
     * 生成rest cacth返回数据
     * @param rs 
     */
    private makeCatchData = (rs: HttpErrorResponse) => {
        if (rs.url && /\/sso\//i.test(rs.url))
            window.location.href = this.config.site.loginUrl;

        return Observable.of({
            isSucc: false,
            status: rs.status,
            statusText: rs.statusText,
            datas: null,
            error: rs.error,
            message: rs.message
        });
    };
    /**
     * 生成最终url
     * @param url 
     */
    absolutelyUrl(url: string): string {
        // return url;
        return this.config.rest.mapPath(url);
    }

    private getHttp(http: Observable<Object>, url: string, type: string, p?: SipRestParam): Observable<object> {
        let owner = p && p.owner;
        p && (p.owner = null);
        if (owner) {
            if (p.cache) {
                let key = {
                    url: url,
                    params: p && p.params
                };
                http = http.cacheToObject(owner, key);
            }

            if (('$isDestroyed' in owner) || ('isDestroyed' in owner)) {
                http = http.breakOff(function () {
                    return owner.$isDestroyed || owner.isDestroyed;
                });
            }

            if ('$showPreLoad' in owner)
                http = owner.$showPreLoad(http);

            return http;
        } else
            return http;
    }

    private mapRestData = rs => {
        return this.config.rest.map(rs);
    };

    /**
     * GET请求
     *
     * @param url URL地址
     * @param p 请求参数
     */
    get<T=any>(url: string, p?: SipRestParam): Observable<SipRestRet<T>> {
        let params: any = p && p.params;
        url = this.absolutelyUrl(url);
        url = this.queryString(url, params);
        return this.getHttp(this.http.get(url, p && p.httpOptions), url, 'get', p)
            .map(this.mapRestData)
            .map(mapData)
            .catch(this.makeCatchData);
    }

    /**
     * POST请求
     *
     * @param url URL地址
     * @param p 参数
     */
    post<T=any>(url: string, p?: SipRestParam): Observable<SipRestRet<T>> {
        let params: any = p && p.params,
            postType: string = p && p.postType;

        postType || (postType = this.config.rest.postType);
        let formData = params || null;
        if (postType == 'form') {
            formData = new FormData();
            Lib.eachProp(params, (item, n) => {
                formData.append(n, Lib.isObject(item) ? JSON.stringify(item) : item);
            });

        }
        return this.getHttp(this.http.post(url, formData, p && p.httpOptions), url, 'post', p)
            .map(this.mapRestData)
            .map(mapData)
            .catch(this.makeCatchData);
    }

    /**
     * DELETE请求
     *
     * @param url URL地址
     * @param p 请求参数
     */
    delete<T=any>(url: string, p?: SipRestParam): Observable<SipRestRet<T>> {
        let params: any = p && p.params;

        url = this.absolutelyUrl(url);
        url = this.queryString(url, params);
        return this.getHttp(this.http.delete(url, p && p.httpOptions), url, 'delete', p)
            .map(this.mapRestData)
            .map(mapData)
            .catch(this.makeCatchData);
    }

    /**
     * DELETE请求
     *
     * @param url URL地址
     * @param p 请求参数
     */
    put<T=any>(url: string, p?: SipRestParam): Observable<SipRestRet<T>> {
        let params: any = p && p.params;

        url = this.absolutelyUrl(url);
        url = this.queryString(url, params);
        return this.getHttp(this.http.delete(url, p && p.httpOptions), url, 'put', p)
            .map(this.mapRestData)
            .map(mapData)
            .catch(this.makeCatchData);
    }


    dict(code: string, conStr?: string, p?: SipRestParam): Observable<SipRestRet<ISipRestDict[]>> {
        p = Lib.extend({}, p);
        p.params = { dictionaryCode: code, conStr: conStr || 'boss' };
        return this.get(this.config.rest.dict, p);
    }

    /**
     * 发送sql请求
     * @param p 
     */
    sql<T=any[]>(p: SipSqlParam): Observable<SipRestSqlRet<T>> {
        let param: any = Lib.extend({}, p.params);

        param.connstr = p.connstr || '';
        param.sqlId = p.sqlId || '';
        param.rows = p.pageSize || 10;
        param.page = p.pageIndex || 1;
        param.sidx = p.sortName || '';
        param.sord = p.sortOrder || '';
        param.searchparam = p.searchparam;

        let url = param.url || this.config.rest.sql.pageList;
        param.url = undefined;
        return this.get(url, {
            params: param,
            owner: p.owner, cache: p.cache,
            httpOptions: p.httpOptions
        }).map(mapSqlData);
    }

    /**
     * 返回 sqlList数据
     */
    sqlList<T=any[]>(p: SipSqlParam): Observable<SipRestSqlRet<T>> {
        p = Lib.extend({ url: this.config.rest.sql.list, pageSize: 999999 }, p);
        return this.sql(p);
    }

    /**
     * 通过sql形式，返回实体, 实体的boolean类型为true|false
     */
    sqlEntity<T=any>(p: SipSqlParam): Observable<SipRestSqlRet<T>> {
        p = Lib.extend({ url: this.config.rest.sql.entity }, p);
        return this.sql(p);
    }

    /**
     * 通过sql形式，返回原始的sql实体, 实体的boolean类型为1|0
     */
    sqlEntityEx<T=any>(p: SipSqlParam): Observable<SipRestSqlRet<T>> {
        p = Lib.extend({ url: this.config.rest.sql.entityEx }, p);
        return this.sql(p);
    }

    /**
     * 执行sql
     * @param p 
     */
    sqlExecute<T=any>(p: SipSqlParam): Observable<SipRestSqlRet<T>> {
        p = Lib.extend({ url: this.config.rest.sql.execute }, p);
        return this.sql(p);
    }

    /**
     * 插入sql, 返回新的实体
     * @param p 
     */
    sqlInsert<T=any>(p: SipSqlParam): Observable<SipRestSqlRet<T>> {
        p = Lib.extend({ url: this.config.rest.sql.insert }, p);
        return this.sql(p);
    }

}
