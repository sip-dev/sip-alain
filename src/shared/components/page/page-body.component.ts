import { Component } from '@angular/core';

@Component({
    selector: 'sip-page-body',
    template: `<nz-spin nzTip="" [nzSpinning]="loading">
    <div style="min-height:300px"><ng-content *ngIf="showed"></ng-content></div>
    </nz-spin>
    `,
    styles: []
})
export class PageBodyComponent {
    showed = false;
    loading = true;
}
