import { Component, TemplateRef, ViewChild, Input } from '@angular/core';

@Component({
    selector: 'sip-card-grid',
    template: `<ng-template>
    <ng-content></ng-content>
  </ng-template>`
})
export class SipCardGridComponent {
    @ViewChild(TemplateRef) template: TemplateRef<any>;
    @Input() gridStyle = {
        width: '25%',
        textAlign: 'center'
    };
}
