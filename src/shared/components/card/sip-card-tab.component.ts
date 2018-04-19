import { Component, TemplateRef, ViewChild, Input } from '@angular/core';

@Component({
    selector: 'sip-card-tab',
    template: `<ng-template>
    <ng-content></ng-content>
  </ng-template>`
})
export class SipCardTabComponent {
    @ViewChild(TemplateRef) template: TemplateRef<any>;
}
