
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { I18NService } from './i18n/i18n.service';

@NgModule({
    providers: [
        I18NService
    ]
})
export class DelonCoreModule {
  constructor( @Optional() @SkipSelf() parentModule: DelonCoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
