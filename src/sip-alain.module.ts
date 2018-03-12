import { NgModule, Optional, SkipSelf, LOCALE_ID, APP_INITIALIZER, Type, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// angular i18n
import { registerLocaleData } from '@angular/common';
import localeZhHans from '@angular/common/locales/zh-Hans';
registerLocaleData(localeZhHans);

// i18n
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { MockOptions, DM_OPTIONS_TOKEN, DEFAULT as MockDefault, DelonMockModule } from '@delon/mock';
import { I18NService } from './delon/i18n/i18n.service';

export function HttpLoaderFactory(http: HttpClient, config: SipAlainConfig) {
    return config.i18nLoader(http);
}

import { SimpleInterceptor, DA_OPTIONS_TOKEN, AuthOptions, DEFAULT as AuthDefault } from '@delon/auth';
import { DefaultInterceptor } from './delon/net/default.interceptor';

import { DelonModule } from './delon/delon.module';
import { SipAlainConfig, SetSipAlainConfig, GetSipAlainConfig } from './core/extends/sip-alain-config';
import { StartupService } from './delon/startup/startup.service';
import { SipAlainCoreModule } from './core/sip-alain-core.module';

export function StartupServiceFactory(startupService: StartupService, config: SipAlainConfig): Function {
    let a;
    return () => startupService.load(config).then(function () { return config.startup(); });
}

export function authOptionsFactory(config: SipAlainConfig) {
    let options: AuthOptions = config.authOptions;
    if (options && options.ignores) {
        options.ignores = options.ignores.map(v => new RegExp(v));
    }
    return Object.assign(AuthDefault, options);
}

@NgModule({
    imports: [
        CommonModule,
        SipAlainCoreModule,
        DelonModule.forRoot(),
        // i18n
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient, SipAlainConfig]
            }
        }),
        HttpClientModule
    ],
    providers: [

    ],
    exports: [
        DelonModule
    ]
})
export class SipAlainModule {
    constructor(@Optional() @SkipSelf() parentModule: SipAlainModule) {
        if (parentModule) {
            throw new Error(`SipAlainModule has already been loaded. Import Core modules in the AppModule only.`);
        }
    }

    static forRoot(config: Type<SipAlainConfig>): ModuleWithProviders {

        return {
            ngModule: SipAlainModule,
            providers: [
                I18NService,
                { provide: SipAlainConfig, useClass: config },
                { provide: LOCALE_ID, useValue: 'zh-Hans' },
                { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true },
                { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
                { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false },
                { provide: DA_OPTIONS_TOKEN, useFactory: authOptionsFactory, deps: [SipAlainConfig] },
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