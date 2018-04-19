import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SipDirectivesModule } from '../directives/sip-directives.module';

import { SipContextmenuComponent } from './menu/sip-contextmenu.component';
import { MenuGroupComponent } from './menu/menu-group.component';
import { MenuItemDividerComponent } from './menu/menu-item-divider.component';
import { MenuItemComponent } from './menu/menu-item.component';
import { MenuSubComponent } from './menu/menu-sub.component';
import { MenuComponent } from './menu/menu.component';
import { MinicolumnComponent } from './minitable/minicolumn.component';
import { MinitableComponent } from './minitable/minitable.component';
import { ModalBodyComponent } from './modal/modal-body.component';
import { ModalFooterComponent } from './modal/modal-footer.component';
import { ModalHeaderComponent } from './modal/modal-header.component';
import { ModalComponent } from './modal/modal.component';
import { PageBodyComponent } from './page/page-body.component';
import { PageHeaderComponent } from './page/page-header.component';
import { PageToolbarComponent } from './page/page-toolbar.component';
import { PageComponent } from './page/page.component';
import { SipCardComponent } from './card/sip-card.component';
import { SearchConentComponent } from './searchConent.component';
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
        MenuGroupComponent,
        MenuItemDividerComponent,
        MenuItemComponent,
        MenuSubComponent,
        MenuComponent,
        MinicolumnComponent,
        MinitableComponent,
        ModalBodyComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalComponent,
        PageBodyComponent,
        PageHeaderComponent,
        PageToolbarComponent,
        PageComponent,
        SipCardComponent,
        SearchConentComponent,
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
        MenuGroupComponent,
        MenuItemDividerComponent,
        MenuItemComponent,
        MenuSubComponent,
        MenuComponent,
        MinicolumnComponent,
        MinitableComponent,
        ModalBodyComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalComponent,
        PageBodyComponent,
        PageHeaderComponent,
        PageToolbarComponent,
        PageComponent,
        SipCardComponent,
        SearchConentComponent,
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
    entryComponents:[ModalComponent]
})
export class SipComponentsModule { }
