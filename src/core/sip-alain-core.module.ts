import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesModule } from './services/services.module';
import { DelonCoreModule } from '../delon/delon-core.module';

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
