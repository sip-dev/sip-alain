import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { SipAlainConfig } from '../../core/extends/sip-alain-config';


/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(private injector: Injector, private config:SipAlainConfig) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): any {
            return this.config.intercept(req, next);
    }
}
