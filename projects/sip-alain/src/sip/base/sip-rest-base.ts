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
    /**定义rest结果提示通知 */
    notifis?: { success?: boolean | string; warn?: boolean | string; error?: boolean | string; };
    /**接口描述 */
    desc?: string;
}

export interface SipRestRet<T=any> {
    /**是否成功 */
    isSucc: boolean;
    /**是否失败 */
    isWarn: boolean;
    /**http状态 */
    status: number;
    /**http状态描述 */
    statusText?: string;
    /**返回数据 */
    datas: T;
    /**服务出错信息 */
    error?: string;
    /**业务出错信息 */
    message?: string;
}

export interface SipSqlParam extends SipRestParam {
    /**库 */
    connstr?: string;
    sqlId?: string;
    /**请求记录数量 */
    pageSize?: number;
    /**当前页面 */
    pageIndex?: number;
    /**排序字段 */
    sortName?: string;
    /**排序方向 */
    sortOrder?: '' | 'asc' | 'desc';
    /**搜索参数 */
    searchparam?: object;
}

export interface SipRestSqlRet<T=any> extends SipRestRet<T> {
    /**当前页面 */
    pageIndex: number;
    /**请求记录数量 */
    pageSize: number;
    /**总页面数量 */
    totalPages: number;
    /**总记录数量 */
    total: number;
}

export interface ISipRestDict {
    "code": string,
    "text": string,
    "status": string,
    "description": string
}
