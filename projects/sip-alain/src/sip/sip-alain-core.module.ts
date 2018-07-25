import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelonCoreModule } from '../delon/delon-core.module';
import { ServicesModule } from './services/services.module';

@NgModule({
    imports: [
        CommonModule,
        DelonCoreModule,
        ServicesModule
    ],
    declarations: [],
    providers: [

    ],
    exports: [
        ServicesModule
    ],
    entryComponents: []
})
export class SipAlainCoreModule { }
