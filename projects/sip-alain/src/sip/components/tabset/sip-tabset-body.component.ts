import { Component, ContentChildren, QueryList } from '@angular/core';
import { SipQueryList } from '../../help/sip-helper';
import { SipTabsetContentComponent } from './sip-tabset-content.component';

@Component({
    selector: 'sip-tabset-body',
    template: '',
    styles: []
})
export class SipTabsetBodyComponent {
    @ContentChildren(SipTabsetContentComponent) _contents: QueryList<SipTabsetContentComponent>;

    @SipQueryList('this._contents') contents;

}
