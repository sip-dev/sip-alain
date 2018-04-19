import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'sip-card-meta-title',
    template: `<ng-template>
    <ng-content></ng-content>
  </ng-template>`
})
export class SipCardMetaTitleComponent {
    @ViewChild(TemplateRef) template: TemplateRef<any>;
}
