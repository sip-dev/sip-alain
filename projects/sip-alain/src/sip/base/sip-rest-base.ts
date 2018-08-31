import { HttpHeaders, HttpParams } from "@angular/common/http";

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
    url?: string;
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

export interface SipSqlParam extends SipRestParam {
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

export interface ISipRestDict {
    "code": string,
    "text": string,
    "status": string,
    "description": string
}
