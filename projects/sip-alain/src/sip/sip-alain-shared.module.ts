import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SipDirectivesModule } from './directives/sip-directives.module';
import { SipComponentsModule } from './components/sip-components.module';
import { DelonSharedModule } from '../delon/delon-shared.module';

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
