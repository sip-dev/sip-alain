import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { SipServicesModule } from './sip/services/sip-services.module';

@NgModule({
    providers: [
    ],
    imports: [
        SipServicesModule
    ],
    exports: [
        SipServicesModule
    ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
