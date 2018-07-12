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
    "error": string;
}

