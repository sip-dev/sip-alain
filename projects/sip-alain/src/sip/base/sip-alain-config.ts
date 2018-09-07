import { HttpClient, HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { Type } from '@angular/core';
import { AdPageHeaderConfig, ReuseTabMatchMode } from '@delon/abc';
import { DelonAuthConfig } from '@delon/auth';
import { SipTableSettings } from '../components/sip-table/sip-table/base/sip-table-settings';
import { SipLoggerOptions } from './sip-logger-options';
import { SipRestParam, SipRestRet, SipRestSqlRet, SipSqlParam } from './sip-rest-base';

/**配置基类 */
export abstract class SipAlainConfig {

    environment?: {
        production: boolean;
        [key: string]: any;
    };

    /**logger参数 */
    loggerOptions: SipLoggerOptions;

    i18n: {
        prefix: string;
        suffix: string;
        default: string;
        langs: { code: string; text: string; }[];
    };

    i18nLoader: (http: HttpClient) => any;
    appDataPath: string;
    startup: () => Promise<any>;
    intercept: (req: HttpRequest<any>, next: HttpHandler) => any;

    authOptions?: DelonAuthConfig;
    pageHeaderConfig?: AdPageHeaderConfig;

    reuseTab?: {
        use: boolean;
        mode: ReuseTabMatchMode;
    };

    site: {
        loginUrl: string;
        logoutUrl: string;
    };

    page: {
        /**只有一个子页面 */
        onceChild: boolean,
        /** 关闭时自动关闭子页面 */
        autoCloseChild: boolean
    };

    /**ui相关配置 */
    ui?:{
        /**alert组件类 */
        alert?:any;
        /**confirm组件类 */
        confirm?:any;
        /**prompt组件类 */
        prompt?:any;
    };

    rest: {
        /**
         * rest url 改造路径
         */
        mapPath: (path: string) => string;
        /**
         * 提交类型form | body
         */
        postType: string;
        /**
         * 字典接口
         */
        dict: string;
        /**
         * 字典接口的connstr, 默认为:boss
         */
        dictConnstr?: string;
        /**
         * rest 数据结构改造
         */
        map: (url: string, response: any) => SipRestRet<any>;
        mapParam: (p: SipRestParam) => SipRestParam;
        catchError: (url: string, response: HttpErrorResponse) => SipRestRet<any>;
        sql: {
            map: (url: string, rs: SipRestRet<any>) => SipRestSqlRet<any>;
            mapParam: (p: SipSqlParam) => any;
            /**
                 * sql数据，有分页
                 */
            pageList: string;
            /**
             * sql数据，无分页
             */
            list: string;
            /**
             * sql数据，返回实体
             */
            entity: string;
            /**
             * sql原始数据，返回实体， 如boolean会返回0|1
             */
            entityEx: string;
            /**
             * 执行sql
             */
            execute: string;
            /**
             * 新增sql记录，返回新增的实体
             */
            insert: string;
        }
    };

    crudtable?: SipTableSettings;

}

let _sipAlainConfig: Type<SipAlainConfig> = null;

export function SetSipAlainConfig(config: Type<SipAlainConfig>) {
    _sipAlainConfig = config;
};

export function GetSipAlainConfig(): Type<SipAlainConfig> {
    return _sipAlainConfig
};