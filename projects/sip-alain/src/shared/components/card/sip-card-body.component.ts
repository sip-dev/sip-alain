import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'sip-card-body',
    template: `<ng-template>
    <ng-content></ng-content>
  </ng-template>`
})
export class SipCardBodyComponent {
    @ViewChild(TemplateRef) template: TemplateRef<any>;
}
