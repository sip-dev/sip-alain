import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ISipContextMenu } from '../../base/i-sip-context-menu';
import { SipComponent, SipNgDestroy, SipNgInit } from '../../help/sip-helper';
import { SipContextMenuService } from '../../services/sip-context-menu.service';

@Component({
    selector: 'sip-contextmenu',
    template: `<ng-template #tmpl><ng-content></ng-content></ng-template>`
})
export class SipContextmenuComponent extends SipComponent {
    @ViewChild('tmpl') tmpl: TemplateRef<any>;

    constructor(vcf: ViewContainerRef, private _contextMenuSrv: SipContextMenuService) {
        super(vcf);
    }

    private pElement: HTMLElement;

    @Input() menu: ISipContextMenu;

    @SipNgInit()
    private _init() {
        setTimeout((p) => {
            if (this.$isDestroyed) return;
            this.pElement = this.$vcf.element.nativeElement.parentNode;
            if (!this.pElement) return;
            this.pElement.addEventListener('contextmenu', this._contextmenu_fn);
        }, 5);
    }

    private _contextmenu_fn = (e: MouseEvent) => {
        let menu = this.menu || { items: [] };
        this.onShow.emit(menu);
        return this._contextMenuSrv.show(menu, e, menu.items && menu.items.length > 0 ? null : this.tmpl);
    }

    @SipNgDestroy()
    private _destroy() {
        if (!this.pElement) return;
        this.pElement.removeEventListener('contextmenu', this._contextmenu_fn);
    }

    @Output() onShow: EventEmitter<any> = new EventEmitter<any>();

    hide() {
        this._contextMenuSrv.hide();
    }

}
