import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'sip-tabset-content',
    template: `<ng-template #tmpl>
    <ng-content></ng-content>
  </ng-template>
  <div *ngIf="contentOnly" [style.display]="display">
      <ng-template [ngTemplateOutlet]="template"></ng-template>
  </div>`
})
export class SipTabsetContentComponent {
    @ViewChild('tmpl') template: TemplateRef<any>;
    display = 'none';
    contentOnly = false;
}
