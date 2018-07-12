import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'sip-card-extra',
    template: `<ng-template>
    <ng-content></ng-content>
  </ng-template>`
})
export class SipCardExtraComponent {
    @ViewChild(TemplateRef) template: TemplateRef<any>;
}
