import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SipShowDirective } from './sip-show.directive';
import { SipRouterLinkDirective } from './sip-router-link.directive';
import { SipAccessDirective } from './sip-access.directive';
import { DelonSharedModule } from '../../delon/delon-shared.module';

@NgModule({
    imports: [
        CommonModule,
        DelonSharedModule
    ],
    declarations: [
        SipShowDirective,
        SipRouterLinkDirective,
        SipAccessDirective
    ],
    providers: [],
    exports:[
        SipShowDirective,
        SipRouterLinkDirective,
        SipAccessDirective
    ],
    entryComponents:[]
})
export class SipDirectivesModule { }
