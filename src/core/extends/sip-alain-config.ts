import { Lib } from 'sip-lib';
import { Type, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpClient } from '@angular/common/http';
import { AuthOptions } from '@delon/auth';
import { MockOptions } from '@delon/mock';
import { ReuseTabMatchMode } from '@delon/abc';

export interface IConfigResetMapRet {
    /**版本号 */
    "version": number;
    /**返回code，200为成功 */
    "returnCode": number;
    /**返回数据内容 */
    "returnValue": any;
    /**返回状, "OK" | "WARNING" | "ERROR" | "ABORT"（内部取消） | "LEGAL_USER"(用户已经退出) */
    "returnStatus": string;
    /**用于UI的提示信息 */
    "returnDesc": string;
    /**用于浏览开发控制log的信息 */
    "error": string
}

export abstract class SipAlainConfig {

    environment?: {
        chore: boolean;
        SERVER_URL: string;
        production: boolean;
        hmr: boolean;
        useHash: boolean;
        [key:string]:any;
    };

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

    authOptions?: AuthOptions;

    reuseTab?: {
        use:boolean;
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
    };

}

let _sipAlainConfig: Type<SipAlainConfig> = null;

export function SetSipAlainConfig(config: Type<SipAlainConfig>) {
    _sipAlainConfig = config;
};

export function GetSipAlainConfig(): Type<SipAlainConfig> {
    return _sipAlainConfig
};