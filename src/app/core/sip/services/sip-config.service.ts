import { HttpClient, HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ReuseTabMatchMode } from '@delon/abc';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SipAlainConfig, SipRestParam, SipRestRet, SipRestSqlRet, SipSqlParam, SipTableSettings } from 'sip-alain';
import { Lib } from 'sip-lib';


let _rmPathSplitRegex = /\/{2,}/g;
let _rmPathSplit = function (path: string) { return path.replace(_rmPathSplitRegex, '/'); };

@Injectable()
export class SipConfigService implements SipAlainConfig {

    constructor(private injector: Injector) { }

    environment = environment;

    loggerOptions = {
        level: environment.loggerLevel,
        global: true,
        globalAs: "sipLogger"
    };

    site = {
        loginUrl: '/themes/metronic/modules/common/login/login_sso.jsp?returnUrl=/',
        logoutUrl: ''
    };

    loadAppData() {
        let http = this.injector.get(_HttpClient);
        return http.get('assets/tmp/app-data.json');
    }

    authOptions = {
        // ignores: [ `\\/login`, `assets\\/` ],
        //login_url: `/passport/login`
        login_url: this.site.loginUrl
    };

    reuseTab = {
        /**是否使用多页面 */
        use: false,
        /**多页url复用模式 */
        mode: ReuseTabMatchMode.URL
    };

    page = {
        /**只有一个子页面 */
        onceChild: true,
        /** 关闭时自动关闭子页面 */
        autoCloseChild: true
    };

    i18n = {
        /**路径前缀 */
        prefix: 'assets/tmp/i18n/',
        /**路径后缀 */
        suffix: '.json',
        /**默认语言, 可以使用TranslateService.getBrowserLang() */
        default: 'zh-CN',
        /**可使用语言 */
        langs: [
            { code: 'en', text: 'English' },
            { code: 'zh-CN', text: '中文' }
        ]
    };

    /**TranslateHttpLoader */
    i18nLoader(http: HttpClient) {
        return new TranslateHttpLoader(http, this.i18n.prefix, this.i18n.suffix);
    }

    /**启动时处理 */
    startup() {
        let tokenService: ITokenService = this.injector.get(DA_SERVICE_TOKEN);
        tokenService.set({
            token: '123456789',
            name: 'bingo',
            email: `bingo@qq.com`,
            id: 10000,
            time: +new Date
        });
        return Promise.resolve(null);
    }

    private goTo(url: string) {
        setTimeout(() => this.injector.get(Router).navigateByUrl(url));
    }

    private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
        // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
        this.injector.get(_HttpClient).end();
        // 业务处理：一些通用操作
        switch (event.status) {
            case 200:
                // 业务层级错误处理，以下假如响应体的 `status` 若不为 `0` 表示业务级异常
                // 并显示 `error_message` 内容

                // const body: any = event instanceof HttpResponse && event.body;
                // if (body && body.status !== 0) {
                //     this.msg.error(body.error_message);
                //     // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
                //     // this.http.get('/').subscribe() 并不会触发
                //     return ErrorObservable.throw(event);
                // }
                break;
            case 401: // 未登录状态码
                //this.goTo('/passport/login');
                location.href = this.site.logoutUrl;
                break;
            case 403:
            case 404:
            case 500:
                if (/\/api\//.test(event.url)) {
                    // let msgSrv: NzMessageService = this.injector.get(NzMessageService);
                    // let ev: HttpErrorResponse = event as HttpErrorResponse;
                    // msgSrv.error(ev.message, { nzDuration: 3000 });
                }
                else
                    this.goTo(`/${event.status}`);
                break;
        }
        return of(event);
    }

    /**http 拦截处理*/
    intercept(req: HttpRequest<any>, next: HttpHandler): any {
        // 统一加上服务端前缀
        let url = req.url;
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
            url = environment.SERVER_URL + url;
        }

        const newReq = req.clone({
            url: url
        });
        return next.handle(newReq).pipe(
            mergeMap((event: any) => {
                // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
                if (event instanceof HttpResponse && event.status === 200)
                    return this.handleData(event);
                // 若一切都正常，则后续操作
                return of(event);
            })//,
            // catchError((err: HttpErrorResponse) => this.handleData(err))
        );
    }

    mapRest(url: string, response: any): SipRestRet<any> {
        if ('version' in response && 'returnValue' in response) {
            return {
                isSucc: response.returnCode == 200,
                isWarn: false,
                status: response.returnCode,
                statusText: 'Ok',
                datas: response.returnValue,
                error: response.error,
                message: response.returnDesc
            };
        } else {
            return {
                isSucc: true,
                isWarn: false,
                status: 200,
                statusText: 'Ok',
                datas: response,
                error: '',
                message: ''
            };
        }
    }

    /**rest相关处理 */
    rest = {
        /**
         * rest url 改造路径
         */
        mapPath: function (path: string) {
            return _rmPathSplit(path);
        },
        /**
         * 提交类型form | body
         */
        postType: 'form',
        /**
         * 字典接口
         */
        dict: 'api/basicData/getDictionaryItems',
        /**定义rest结果提示信息 */
        message: { success: '操作成功！', warn: true, error: false },
        /**定义rest结果提示通知 */
        notifis: { success: false, warn: false, error: true },
        /**
         * rest 数据结构改造
         */
        map: (url: string, response: any): SipRestRet<any> => {
            return this.mapRest(url, response);
        },
        mapParam: function (p: SipRestParam): SipRestParam {
            return p;
        },
        catchError: (url: string, response: HttpErrorResponse): SipRestRet<any> => {
            return {
                isSucc: false,
                isWarn: false,
                status: response.status,
                statusText: response.statusText,
                datas: null,
                error: response.error,
                message: response.message
            };
        },
        sql: {
            /**
             * sql 数据结构改造
             */
            map: (url: string, rs: SipRestRet<any>): SipRestSqlRet<any> => {
                let sqlData = rs.datas;
                let retData: any = Lib.extend(rs, {
                    pageIndex: sqlData ? sqlData.PageIndex : 0,
                    pageSize: sqlData ? sqlData.PageSize : 10,
                    totalPages: sqlData ? sqlData.TotalPages : 0,
                    total: sqlData ? sqlData.TotalRecords : 0
                });
                retData.datas = sqlData ? sqlData.Data : [];

                return retData as SipRestSqlRet<any>;
            },
            mapParam: function (p: SipSqlParam): any {
                let param: any = Lib.extend({
                    connstr: p.connstr || '',
                    sqlId: p.sqlId || '',
                    rows: p.pageSize || 10,
                    page: p.pageIndex || 1,
                    sidx: p.sortName || '',
                    sord: p.sortOrder || '',
                    searchparam: p.searchparam,
                    url: p.url
                }, p.params);
                return param;
            },
            /**
             * sql数据，有分页
             */
            pageList: 'api/basicData/loadGridData',
            /**
             * sql数据，无分页
             */
            list: 'api/basicApi/getList',
            /**
             * sql数据，返回实体
             */
            entity: 'api/basicApi/getEntity',
            /**
             * sql原始数据，返回实体， 如boolean会返回0|1
             */
            entityEx: 'api/basicApi/getEntityEx',
            /**
             * 执行sql
             */
            execute: 'api/basicApi/execute',
            /**
             * 新增sql记录，返回新增的实体
             */
            insert: 'api/basicApi/insert'
        }
    };

    crudtable = new SipTableSettings({
        pageSize: 10,
        selectionMode: 'operate'
    });
}
