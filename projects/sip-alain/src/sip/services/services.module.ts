import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SipCacheService } from './sip-cache.service';
import { SipRestService } from './sip-rest.service';
import { SipEventService } from './sip-event.service';
import { SipAppContainerService } from './sip-app-container.service';
import { SipContextMenuService } from './sip-context-menu.service';
import { SipLoggerService } from './sip-logger.service';
import { SipNoticeService } from './sip-notice.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        SipCacheService,
        SipRestService,
        SipEventService,
        SipAppContainerService,
        SipContextMenuService,
        SipLoggerService,
        SipNoticeService
    ],
    exports:[],
    entryComponents:[]
})
export class ServicesModule { }
