import { HttpClient, HttpHandler, HttpRequest } from '@angular/common/http';
import { Type } from '@angular/core';
import { AdPageHeaderConfig, ReuseTabMatchMode } from '@delon/abc';
import { DelonAuthConfig } from '@delon/auth';
import { IConfigResetMapRet } from './i-config-reset-map-ret';
import { SipLoggerOptions } from './sip-logger-options';

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
        map: (rs) => IConfigResetMapRet;

        sql: {
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

    minitable: {
        /**
         * 页面记录数
         */
        pageSize: number;
        /**是否多选 */
        multiSelect: boolean;
        /**
         * 选择模式，分别是操作模式(operate)和选择模式(select)
         */
        selectMode: string;
        /**是否单过滤, 默认true */
        filterSingle?: boolean;
    };

}

let _sipAlainConfig: Type<SipAlainConfig> = null;

export function SetSipAlainConfig(config: Type<SipAlainConfig>) {
    _sipAlainConfig = config;
};

export function GetSipAlainConfig(): Type<SipAlainConfig> {
    return _sipAlainConfig
};