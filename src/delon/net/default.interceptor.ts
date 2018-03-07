import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

import { _HttpClient } from '@delon/theme';
import { SipAlainConfig } from '../../core/extends/sip-alain-config';

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): any {
            // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
            this.injector.get(_HttpClient).end();
            let config:SipAlainConfig = this.injector.get(SipAlainConfig);
            return config && config.intercept(req, next);
    }
}
