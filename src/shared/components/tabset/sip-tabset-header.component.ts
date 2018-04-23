import { Component, ContentChildren, QueryList } from '@angular/core';
import { SipTabsetTitleComponent } from './sip-tabset-title.component';

@Component({
    selector: 'sip-tabset-header',
    template: '',
    styles: []
})
export class SipTabsetHeaderComponent {
    @ContentChildren(SipTabsetTitleComponent) titles: QueryList<SipTabsetTitleComponent>;
}
