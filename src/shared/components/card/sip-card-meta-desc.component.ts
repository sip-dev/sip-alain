import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'sip-card-meta-desc',
    template: `<ng-template>
    <ng-content></ng-content>
  </ng-template>`
})
export class SipCardMetaDescComponent {
    @ViewChild(TemplateRef) template: TemplateRef<any>;
}
