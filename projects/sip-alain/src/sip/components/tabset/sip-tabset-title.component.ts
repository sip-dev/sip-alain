import { Component, Input, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
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

    @Input() disabled = false;

    @Output() click: EventEmitter<any> = new EventEmitter<any>();
    @Output() select: EventEmitter<any> = new EventEmitter<any>();
    @Output() deselect: EventEmitter<any> = new EventEmitter<any>();

}
