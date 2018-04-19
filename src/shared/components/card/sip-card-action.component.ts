import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'sip-card-action',
    template: `<ng-template>
    <ng-content></ng-content>
  </ng-template>`
})
export class SipCardActionComponent {
    @ViewChild(TemplateRef) template: TemplateRef<any>;
}
