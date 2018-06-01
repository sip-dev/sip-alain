import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { SipConfigService } from './sip-config.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [],
    providers: [
        SipConfigService
    ],
    exports:[],
    entryComponents:[]
})
export class SipServicesModule { }
