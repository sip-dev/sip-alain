import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { SipTabsetContentComponent } from './sip-tabset-content.component';

@Component({
    selector: 'sip-tabset-title',
    template: `<ng-template>
    <ng-content></ng-content>
  </ng-template>`,
    styles: []
})
export class SipTabsetTitleComponent {
    @ViewChild(TemplateRef) template: TemplateRef<any>;

    @Input() content: SipTabsetContentComponent;
}
