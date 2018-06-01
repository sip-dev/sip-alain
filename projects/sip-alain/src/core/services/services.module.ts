import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SipCacheService } from './sip-cache.service';
import { SipRestService } from './sip-rest.service';
import { SipEventService } from './sip-event.service';
import { SipAppContainerService } from './sip-app-container.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        SipCacheService,
        SipRestService,
        SipEventService,
        SipAppContainerService
    ],
    exports:[],
    entryComponents:[]
})
export class ServicesModule { }
