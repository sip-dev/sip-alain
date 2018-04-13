
// angular i18n
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import localeZhHans from '@angular/common/locales/zh-Hans';
import { APP_INITIALIZER, LOCALE_ID, ModuleWithProviders, NgModule, Optional, SkipSelf, Type } from '@angular/core';
import { AdPageHeaderConfig } from '@delon/abc';
import { DelonAuthConfig, SimpleInterceptor } from '@delon/auth';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
// i18n
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SipAlainConfig } from './core/extends/sip-alain-config';
import { SipAlainCoreModule } from './core/sip-alain-core.module';
import { DelonModule } from './delon/delon.module';
import { I18NService } from './delon/i18n/i18n.service';
import { throwIfAlreadyLoaded } from './delon/module-import-guard';
import { DefaultInterceptor } from './delon/net/default.interceptor';
import { StartupService } from './delon/startup/startup.service';
import { SipAlainSharedModule } from './shared/sip-alain-shared.module';

registerLocaleData(localeZhHans);


// region: global config functions

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient, config: SipAlainConfig) {
    return config.i18nLoader(http);
}

export function StartupServiceFactory(startupService: StartupService, config: SipAlainConfig): Function {
    let a;
    return () => startupService.load(config).then(function () { return config.startup(); });
}

export function pageHeaderConfig(config: SipAlainConfig): AdPageHeaderConfig {
    return Object.assign(new AdPageHeaderConfig(), config.pageHeaderConfig || { home_i18n: 'home' });
}

export function delonAuthConfig(config: SipAlainConfig): DelonAuthConfig {
    return Object.assign(new DelonAuthConfig(), config.authOptions || {
        login_url: '/passport/login'
    });
}

// endregion

@NgModule({
    imports: [
        HttpClientModule,
        DelonModule.forRoot(),
        SipAlainCoreModule,
        SipAlainSharedModule,
        // i18n
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient, SipAlainConfig]
            }
        })
    ],
    providers: []
})
export class SipAlainModule {
    constructor(@Optional() @SkipSelf() parentModule: SipAlainModule) {
        throwIfAlreadyLoaded(parentModule, 'SipAlainModule');
    }

    static forRoot(config: Type<SipAlainConfig>): ModuleWithProviders {

        return {
            ngModule: SipAlainModule,
            providers: [
                // TIPS：@delon/abc 有大量的全局配置信息，例如设置所有 `simple-table` 的页码默认为 `20` 行
                // { provide: SimpleTableConfig, useFactory: simpleTableConfig }
                { provide: LOCALE_ID, useValue: 'zh-Hans' },
                { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true },
                { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
                { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false },
                { provide: AdPageHeaderConfig, useFactory: pageHeaderConfig, deps: [SipAlainConfig] },
                { provide: DelonAuthConfig, useFactory: delonAuthConfig, deps: [SipAlainConfig] },
                StartupService,
                {
                    provide: APP_INITIALIZER,
                    useFactory: StartupServiceFactory,
                    deps: [StartupService, SipAlainConfig],
                    multi: true
                }
            ]
        };
    }

}
