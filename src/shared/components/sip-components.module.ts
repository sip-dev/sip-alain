import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SipDirectivesModule } from '../directives/sip-directives.module';

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
import { SipCardComponent } from './card/sip-card.component';
import { SipSearchConentComponent } from './sip-search-conent.component';
import { DelonSharedModule } from '../../delon/delon-shared.module';
import { SipCardTitleComponent } from './card/sip-card-title.component';
import { SipCardExtraComponent } from './card/sip-card-extra.component';
import { SipCardBodyComponent } from './card/sip-card-body.component';
import { SipCardTabComponent } from './card/sip-card-tab.component';
import { SipCardMetaComponent } from './card/sip-card-meta.component';
import { SipCardMetaTitleComponent } from './card/sip-card-meta-title.component';
import { SipCardMetaDescComponent } from './card/sip-card-meta-desc.component';
import { SipCardMetaAvatarComponent } from './card/sip-card-meta-avatar.component';
import { SipCardActionComponent } from './card/sip-card-action.component';
import { SipCardCoverComponent } from './card/sip-card-cover.component';
import { SipCardGridComponent } from './card/sip-card-grid.component';

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
        SipCardGridComponent
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
        SipCardGridComponent
    ],
    entryComponents:[SipModalComponent]
})
export class SipComponentsModule { }
