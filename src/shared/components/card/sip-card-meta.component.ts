import { Component, TemplateRef, ViewChild, ContentChild } from '@angular/core';
import { SipCardMetaTitleComponent } from './sip-card-meta-title.component';
import { SipCardMetaDescComponent } from './sip-card-meta-desc.component';
import { SipCardMetaAvatarComponent } from './sip-card-meta-avatar.component';

@Component({
    selector: 'sip-card-meta',
    template:''
})
export class SipCardMetaComponent {
	@ContentChild(SipCardMetaTitleComponent) title: SipCardMetaTitleComponent;
	@ContentChild(SipCardMetaDescComponent) desc: SipCardMetaDescComponent;
	@ContentChild(SipCardMetaAvatarComponent) avatar: SipCardMetaAvatarComponent;
}
