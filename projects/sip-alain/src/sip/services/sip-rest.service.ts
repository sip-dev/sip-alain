import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { breakOff, cacheToObject, Lib } from 'sip-lib';
import { SipAlainConfig } from '../base/sip-alain-config';
import { ISipRestDict, SipRestParam, SipRestRet, SipRestSqlRet, SipSqlParam } from '../base/sip-rest-base';
import { SipNoticeService } from './sip-notice.service';


@Injectable()
export class SipRestService {

    constructor(private _config: SipAlainConfig,
        private _http: HttpClient,
        private _notice: SipNoticeService) { }

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
     * 生成最终url
     * @param url 
     */
    absolutelyUrl(url: string): string {
        // return url;
        return this._config.rest.mapPath(url);
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
                http = http.pipe(cacheToObject(owner, key));
            }

            if (('$isDestroyed' in owner) || ('isDestroyed' in owner)) {
                http = http.pipe(breakOff(function () {
                    return owner.$isDestroyed || owner.isDestroyed;
                }));
            }

            return http;
        } else
            return http;
    }

    private _showNotice(ret:SipRestRet, p: SipRestParam){
        let message = Object.assign({}, this._config.rest.message, p.message);
        let notifis = Object.assign({}, this._config.rest.notifis, p.notifis);
        let temp;
        if (ret.isWarn) {
            temp = message.warn;
            temp && this._notice.message.warning(temp === true ? ret.message : temp);
            temp = notifis.warn;
            temp && this._notice.notifies.warning(p.desc || '警告信息', temp === true ? ret.message : temp)
        } else if (ret.isSucc) {
            temp = message.success;
            let defText = '操作成功！';
            temp && this._notice.message.success(temp === true ? defText : temp);
            temp = notifis.success;
            temp && this._notice.notifies.success(p.desc || '成功信息', temp === true ? defText : temp)
        } else {
            temp = message.error;
            temp && this._notice.message.error(temp === true ? ret.message : temp);
            temp = notifis.success;
            temp && this._notice.notifies.error(p.desc || '出错信息', temp === true ? ret.message : temp)
        }
    }

    private mapRestData = <T>(url: string, p: SipRestParam): (response: any) => SipRestRet<T> => {
        return response => {
            let ret = this._config.rest.map(url, response);
            this._showNotice(ret, p);
            return ret;
        }
    };
    private mapSqlData = <T>(url: string): (response: any) => SipRestSqlRet<T> => {
        return response => {
            return this._config.rest.sql.map(url, response);
        }
    };

    /**
     * 生成rest cacth返回数据
     * @param rs 
     */
    private makeCatchData = <T>(url: string, p: SipRestParam): (response: any) => Observable<SipRestRet<T>> => {
        return (response: HttpErrorResponse) => {
            let ret = this._config.rest.catchError(url, response);
            this._showNotice(ret, p);

            return of(ret);
        }
    };

    private mapRestParam(url: string, p: SipRestParam): SipRestParam {
        p || (p = {});
        p.url = url;
        return this._config.rest.mapParam(p);
    }

    private mapSqlParam(p: SipSqlParam): any {
        p || (p = {});
        return this._config.rest.sql.mapParam(p);
    }

    /**
     * GET请求
     *
     * @param url URL地址
     * @param p 请求参数
     */
    get<T=any>(url: string, p?: SipRestParam): Observable<SipRestRet<T>> {
        p = this.mapRestParam(url, p);
        let params: any = p && p.params;
        url = this.absolutelyUrl(p.url);
        url = this.queryString(url, params);
        return this.getHttp(this._http.get(url, p.httpOptions), url, 'get', p)
            .pipe(
                map(this.mapRestData<T>(url, p)),
                // map(mapData),
                catchError(this.makeCatchData<T>(url, p))
            )
    }

    /**
     * POST请求
     *
     * @param url URL地址
     * @param p 参数
     */
    post<T=any>(url: string, p?: SipRestParam): Observable<SipRestRet<T>> {
        p = this.mapRestParam(url, p);
        url = p.url;
        let params: any = p && p.params,
            postType: string = p && p.postType;

        postType || (postType = this._config.rest.postType);
        let formData = params || null;
        if (postType == 'form') {
            formData = new FormData();
            Lib.eachProp(params, (item, n) => {
                formData.append(n, Lib.isObject(item) ? JSON.stringify(item) : item);
            });

        }
        return this.getHttp(this._http.post(url, formData, p.httpOptions), url, 'post', p)
            .pipe(
                map(this.mapRestData<T>(url, p)),
                // map(mapData),
                catchError(this.makeCatchData<T>(url, p))
            );
    }

    /**
     * DELETE请求
     *
     * @param url URL地址
     * @param p 请求参数
     */
    delete<T=any>(url: string, p?: SipRestParam): Observable<SipRestRet<T>> {
        p = this.mapRestParam(url, p);
        let params: any = p && p.params;

        url = this.absolutelyUrl(p.url);
        url = this.queryString(url, params);
        return this.getHttp(this._http.delete(url, p.httpOptions), url, 'delete', p)
            .pipe(
                map(this.mapRestData<T>(url, p)),
                // map(mapData),
                catchError(this.makeCatchData<T>(url, p))
            );
    }

    /**
     * DELETE请求
     *
     * @param url URL地址
     * @param p 请求参数
     */
    put<T=any>(url: string, p?: SipRestParam): Observable<SipRestRet<T>> {
        p = this.mapRestParam(url, p);
        let params: any = p && p.params;

        url = this.absolutelyUrl(p.url);
        url = this.queryString(url, params);
        return this.getHttp(this._http.delete(url, p.httpOptions), url, 'put', p)
            .pipe(
                map(this.mapRestData<T>(url, p)),
                // map(mapData),
                catchError(this.makeCatchData<T>(url, p))
            );
    }

    dict(code: string, conStr?: string, p?: SipRestParam): Observable<SipRestRet<ISipRestDict[]>> {
        p = Lib.extend({}, p);
        p.params = { dictionaryCode: code, conStr: conStr || this._config.rest.dictConnstr || 'boss' };
        return this.get(this._config.rest.dict, p);
    }

    /**
     * 发送sql请求
     * @param p 
     */
    sql<T=any[]>(p: SipSqlParam): Observable<SipRestSqlRet<T>> {
        p.url || (p.url = this._config.rest.sql.pageList);
        let param: any = this.mapSqlParam(p);

        let url = param.url;
        param.url = undefined;
        return this.get(url, {
            params: param,
            owner: p.owner, cache: p.cache,
            httpOptions: p.httpOptions
        }).pipe(
            map(this.mapSqlData<T>(url)),
        );
    }

    /**
     * 返回 sqlList数据
     */
    sqlList<T=any[]>(p: SipSqlParam): Observable<SipRestSqlRet<T>> {
        p = Lib.extend({ url: this._config.rest.sql.list, pageSize: 999999 }, p);
        return this.sql(p);
    }

    /**
     * 通过sql形式，返回实体, 实体的boolean类型为true|false
     */
    sqlEntity<T=any>(p: SipSqlParam): Observable<SipRestSqlRet<T>> {
        p = Lib.extend({ url: this._config.rest.sql.entity }, p);
        return this.sql(p);
    }

    /**
     * 通过sql形式，返回原始的sql实体, 实体的boolean类型为1|0
     */
    sqlEntityEx<T=any>(p: SipSqlParam): Observable<SipRestSqlRet<T>> {
        p = Lib.extend({ url: this._config.rest.sql.entityEx }, p);
        return this.sql(p);
    }

    /**
     * 执行sql
     * @param p 
     */
    sqlExecute<T=any>(p: SipSqlParam): Observable<SipRestSqlRet<T>> {
        p = Lib.extend({ url: this._config.rest.sql.execute }, p);
        return this.sql(p);
    }

    /**
     * 插入sql, 返回新的实体
     * @param p 
     */
    sqlInsert<T=any>(p: SipSqlParam): Observable<SipRestSqlRet<T>> {
        p = Lib.extend({ url: this._config.rest.sql.insert }, p);
        return this.sql(p);
    }

}
