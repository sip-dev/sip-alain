import { Component, ViewContainerRef, Optional, ContentChild } from '@angular/core';

import { ReuseTabService } from '@delon/abc';
import { PageBodyComponent } from './page-body.component';
import { SipComponent, SipInject, SipNgInit } from '../../../core/extends/sip-helper';

@Component({
    selector: 'sip-page',
    template: `<div><ng-content></ng-content></div>`,
    styles: []
})
export class PageComponent extends SipComponent {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
        this.$business.$publish('SipPage.Set', this);
    }

    @SipInject(ReuseTabService)
    private _rts: ReuseTabService

    @ContentChild(PageBodyComponent)
    private _body: PageBodyComponent;

    @SipNgInit()
    private _init() {
        let menu = this.$menuItem;
        if (menu) {
            this.navigator = this.title = menu.text;
            this.desc = menu.description;
        }
    }

    url: string;
    desc: string;
    navigator: string;
    private _title: string;
    public get title(): string {
        return this._title;
    }
    public set title(p: string) {
        this._title = p;
        this._rts.title = p;
    }

    public get showed(): boolean {
        return this._body && this._body.showed;
    }
    public set showed(p: boolean) {
        this._body && (this._body.showed = p);
    }
    public get loading(): boolean {
        return this._body && this._body.loading;
    }
    public set loading(p: boolean) {
        this._body && (this._body.loading = p);
    }

}
