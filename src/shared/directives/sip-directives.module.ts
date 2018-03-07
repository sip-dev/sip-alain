import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowDirective } from './show.directive';
import { RouterLinkDirective } from './router-link.directive';
import { AccessDirective } from './access.directive';
import { DelonSharedModule } from '../../delon/delon-shared.module';

@NgModule({
    imports: [
        CommonModule,
        DelonSharedModule
    ],
    declarations: [
        ShowDirective,
        RouterLinkDirective,
        AccessDirective
    ],
    providers: [],
    exports:[
        ShowDirective,
        RouterLinkDirective,
        AccessDirective
    ],
    entryComponents:[]
})
export class SipDirectivesModule { }
