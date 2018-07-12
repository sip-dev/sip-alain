import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelonSharedModule } from '../../delon/delon-shared.module';
import { SipDirectivesModule } from '../directives/sip-directives.module';
import { SipCardActionComponent } from './card/sip-card-action.component';
import { SipCardBodyComponent } from './card/sip-card-body.component';
import { SipCardCoverComponent } from './card/sip-card-cover.component';
import { SipCardExtraComponent } from './card/sip-card-extra.component';
import { SipCardGridComponent } from './card/sip-card-grid.component';
import { SipCardMetaAvatarComponent } from './card/sip-card-meta-avatar.component';
import { SipCardMetaDescComponent } from './card/sip-card-meta-desc.component';
import { SipCardMetaTitleComponent } from './card/sip-card-meta-title.component';
import { SipCardMetaComponent } from './card/sip-card-meta.component';
import { SipCardTabComponent } from './card/sip-card-tab.component';
import { SipCardTitleComponent } from './card/sip-card-title.component';
import { SipCardComponent } from './card/sip-card.component';
import { SipContextmenuComponent } from './menu/sip-contextmenu.component';
import { SipMenuGroupComponent } from './menu/sip-menu-group.component';
import { SipMenuItemDividerComponent } from './menu/sip-menu-item-divider.component';
import { SipMenuItemComponent } from './menu/sip-menu-item.component';
import { SipMenuSubComponent } from './menu/sip-menu-sub.component';
import { SipMenuComponent } from './menu/sip-menu.component';
import { SipMinicolumnComponent } from './minitable/sip-minicolumn.component';
import { SipMinitableComponent } from './minitable/sip-minitable.component';
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
        SipMinicolumnComponent,
        SipMinitableComponent,
        SipModalBodyComponent,
        SipModalFooterComponent,
        SipModalHeaderComponent,
        SipModalComponent,
        SipPageBodyComponent,
        SipPageHeaderComponent,
        SipPageToolbarComponent,
        SipPageComponent,
        SipCardComponent,
        SipSearchConentComponent,
        SipCardTitleComponent,
        SipCardExtraComponent,
        SipCardBodyComponent,
        SipCardTabComponent,
        SipCardMetaComponent,
        SipCardMetaTitleComponent,
        SipCardMetaDescComponent,
        SipCardMetaAvatarComponent,
        SipCardActionComponent,
        SipCardCoverComponent,
        SipCardGridComponent,
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
        SipMinicolumnComponent,
        SipMinitableComponent,
        SipModalBodyComponent,
        SipModalFooterComponent,
        SipModalHeaderComponent,
        SipModalComponent,
        SipPageBodyComponent,
        SipPageHeaderComponent,
        SipPageToolbarComponent,
        SipPageComponent,
        SipCardComponent,
        SipSearchConentComponent,
        SipCardTitleComponent,
        SipCardExtraComponent,
        SipCardBodyComponent,
        SipCardTabComponent,
        SipCardMetaComponent,
        SipCardMetaTitleComponent,
        SipCardMetaDescComponent,
        SipCardMetaAvatarComponent,
        SipCardActionComponent,
        SipCardCoverComponent,
        SipCardGridComponent,
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
