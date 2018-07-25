import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelonSharedModule } from '../../delon/delon-shared.module';
import { SipDirectivesModule } from '../directives/sip-directives.module';
import { SipContextmenuComponent } from './menu/sip-contextmenu.component';
import { SipMenuGroupComponent } from './menu/sip-menu-group.component';
import { SipMenuItemDividerComponent } from './menu/sip-menu-item-divider.component';
import { SipMenuItemComponent } from './menu/sip-menu-item.component';
import { SipMenuSubComponent } from './menu/sip-menu-sub.component';
import { SipMenuComponent } from './menu/sip-menu.component';
import { SipModalBodyComponent } from './modal/sip-modal-body.component';
import { SipModalFooterComponent } from './modal/sip-modal-footer.component';
import { SipModalHeaderComponent } from './modal/sip-modal-header.component';
import { SipModalComponent } from './modal/sip-modal.component';
import { SipPageBodyComponent } from './page/sip-page-body.component';
import { SipPageHeaderComponent } from './page/sip-page-header.component';
import { SipPageToolbarComponent } from './page/sip-page-toolbar.component';
import { SipPageComponent } from './page/sip-page.component';
import { SipAppContainerComponent } from './sip-app-container.component';
import { SipSearchConentComponent } from './sip-search-conent.component';
import { SipTabsetBodyComponent } from './tabset/sip-tabset-body.component';
import { SipTabsetContentComponent } from './tabset/sip-tabset-content.component';
import { SipTabsetHeaderComponent } from './tabset/sip-tabset-header.component';
import { SipTabsetTitleComponent } from './tabset/sip-tabset-title.component';
import { SipTabsetComponent } from './tabset/sip-tabset.component';



@NgModule({
    imports: [
        CommonModule,
        DelonSharedModule,
        SipDirectivesModule
    ],
    declarations: [
        SipContextmenuComponent,
        SipMenuGroupComponent,
        SipMenuItemDividerComponent,
        SipMenuItemComponent,
        SipMenuSubComponent,
        SipMenuComponent,
        SipModalBodyComponent,
        SipModalFooterComponent,
        SipModalHeaderComponent,
        SipModalComponent,
        SipPageBodyComponent,
        SipPageHeaderComponent,
        SipPageToolbarComponent,
        SipPageComponent,
        SipSearchConentComponent,
        SipTabsetComponent,
        SipTabsetTitleComponent,
        SipTabsetHeaderComponent,
        SipTabsetContentComponent,
        SipTabsetBodyComponent,
        SipAppContainerComponent
    ],
    providers: [],
    exports:[
        SipContextmenuComponent,
        SipMenuGroupComponent,
        SipMenuItemDividerComponent,
        SipMenuItemComponent,
        SipMenuSubComponent,
        SipMenuComponent,
        SipModalBodyComponent,
        SipModalFooterComponent,
        SipModalHeaderComponent,
        SipModalComponent,
        SipPageBodyComponent,
        SipPageHeaderComponent,
        SipPageToolbarComponent,
        SipPageComponent,
        SipSearchConentComponent,
        SipTabsetComponent,
        SipTabsetTitleComponent,
        SipTabsetHeaderComponent,
        SipTabsetContentComponent,
        SipTabsetBodyComponent,
        SipAppContainerComponent
    ],
    entryComponents:[SipModalComponent]
})
export class SipComponentsModule { }
