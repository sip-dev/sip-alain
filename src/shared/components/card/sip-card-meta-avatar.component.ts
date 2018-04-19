import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'sip-card-meta-avatar',
    template: `<ng-template>
    <ng-content></ng-content>
  </ng-template>`
})
export class SipCardMetaAvatarComponent {
    @ViewChild(TemplateRef) template: TemplateRef<any>;
}
