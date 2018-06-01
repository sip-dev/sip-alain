import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'sip-card-cover',
    template: `<ng-template>
    <ng-content></ng-content>
  </ng-template>`
})
export class SipCardCoverComponent {
    @ViewChild(TemplateRef) template: TemplateRef<any>;
}
