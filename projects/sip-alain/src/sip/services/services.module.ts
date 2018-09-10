import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SipAppContainerService } from './sip-app-container.service';
import { SipCacheService } from './sip-cache.service';
import { SipContextMenuService } from './sip-context-menu.service';
import { SipEventService } from './sip-event.service';
import { SipLoggerService } from './sip-logger.service';
import { SipNoticeService } from './sip-notice.service';
import { SipRestService } from './sip-rest.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        SipCacheService,
        SipNoticeService,
        SipRestService,
        SipEventService,
        SipAppContainerService,
        SipContextMenuService,
        SipLoggerService
    ],
    exports:[],
    entryComponents:[]
})
export class ServicesModule { }
