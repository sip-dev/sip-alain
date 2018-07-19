
// angular i18n
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { SipAlainConfig } from './base/sip-alain-config';
import { SipAlainCoreModule } from './sip-alain-core.module';
import { SipAlainSharedModule } from './sip-alain-shared.module';

@NgModule({
    imports: [
        HttpClientModule,
        SipAlainSharedModule
    ],
    providers: [],
    exports: [
        SipAlainSharedModule
    ]
})
export class SipAlainModule {
    constructor() {
    }

    static forRoot(config: Type<SipAlainConfig>): ModuleWithProviders {

        return SipAlainCoreModule.forRoot(config);
    }

}
