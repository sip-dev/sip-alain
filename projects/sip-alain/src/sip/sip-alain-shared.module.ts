import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelonSharedModule } from '../delon/delon-shared.module';
import { SipComponentsModule } from './components/sip-components.module';
import { SipDirectivesModule } from './directives/sip-directives.module';

@NgModule({
    imports: [
        CommonModule,
        DelonSharedModule,
        SipDirectivesModule,
        SipComponentsModule
    ],
    declarations: [],
    providers: [],
    exports: [
        DelonSharedModule,
        SipDirectivesModule,
        SipComponentsModule
    ],
    entryComponents: []
})
export class SipAlainSharedModule { }
