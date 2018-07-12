import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'sip-card-title',
    template: `<ng-template>
    <ng-content></ng-content>
  </ng-template>`
})
export class SipCardTitleComponent {
    @ViewChild(TemplateRef) template: TemplateRef<any>;
}
