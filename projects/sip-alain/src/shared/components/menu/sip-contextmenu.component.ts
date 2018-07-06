import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { Lib } from 'sip-lib';
import { IContextMenu } from '../../../core/extends/sip-contextmenu';
import { SipComponent, SipNgDestroy, SipNgInit } from '../../../core/extends/sip-helper';

@Component({
    selector: 'sip-contextmenu',
    template: `<ng-template #tmpl><div class="sip-contextmenu"
     [style.left]="_left" [style.top]="_top" (mousedown)="mousedown($event)" (click)="click($event)">
    <ng-content *ngIf="!menu" ></ng-content>
    <sip-menu *ngIf="menu" [width]="menu.width" [datas]="menu.items"></sip-menu>
  </div></ng-template>`,
    styles: [`.sip-contextmenu {position: absolute;z-index:10000;}`]
})
export class SipContextmenuComponent extends SipComponent {
    @ViewChild('tmpl') tmpl: TemplateRef<any>;

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    private pElement: HTMLElement;

    @Input() menu: IContextMenu;
    @Input() menuFactory: any;

    _left = '0';
    _top = '0';

    mousedown(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    click(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        this.hide();
        return false;
    }

    @SipNgInit()
    private _init() {
        setTimeout((p) => {
            this.pElement = this.$vcf.element.nativeElement.parentNode;
            if (!this.pElement) return;
            this.pElement.addEventListener('contextmenu', this._contextmenu_fn);
            document.documentElement.addEventListener('mousedown', this._doc_mousedown);
        }, 5);
    }

    private _contextmenu_fn = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        let factory = this.menuFactory;
        if (factory) {
            let menu: IContextMenu = { items: null };
            factory(menu);
            if (!menu.width) menu.width = '140px';
            if (!menu.items || !menu.items.length) return false;
            this.menu = menu;
        }

        this.show();
        let offset = Lib.offset(document.body);
        this._left = (e.pageX - offset.left) + 'px';
        this._top = (e.pageY - offset.top) + 'px';
        return false;
    }

    private _doc_mousedown = () => {
        this.hide();
    }

    @SipNgDestroy()
    private _destroy() {
        if (!this.pElement) return;
        document.documentElement.removeEventListener('mousedown', this._doc_mousedown);
        this.pElement.removeEventListener('contextmenu', this._contextmenu_fn);
        this._container && this._container.destroy();
        this._container = null;
    }

    @Output() onShow: EventEmitter<any> = new EventEmitter<any>();

    _container: ViewRef;
    show() {
        let menu: any = {};
        this.onShow.emit(menu);
        this.menu = menu;
        if (!this._container)
            this._container = this.$appendTemplate(this.tmpl, null, true);
    }

    hide() {
        if (this._container) {
            this._container.destroy();
            this._container = null;
        }
    }

}
