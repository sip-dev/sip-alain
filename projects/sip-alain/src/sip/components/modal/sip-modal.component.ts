import { Component, ContentChild, Input, ViewContainerRef } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { SipComponent, SipInject, SipNgDestroy, SipNgInit, SipSubscribe } from '../../help/sip-helper';
import { SipModalBodyComponent } from './sip-modal-body.component';
import { SipModalFooterComponent } from './sip-modal-footer.component';
import { SipModalHeaderComponent } from './sip-modal-header.component';

@Component({
    selector: 'sip-modal',
    template: `<ng-content></ng-content>`,
    styles: []
})
export class SipModalComponent extends SipComponent {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
        this.$business.$publish('SipModal.Set', this);
    }

    @SipInject(NzModalService)
    private _modalSrv: NzModalService

    @ContentChild(SipModalHeaderComponent) _header: SipModalHeaderComponent;
    @ContentChild(SipModalBodyComponent) _body: SipModalBodyComponent;
    @ContentChild(SipModalFooterComponent) _footer: SipModalFooterComponent;

    private _nzModal: NzModalRef;

    @Input() width = 'auto';
    @Input() height = 'auto';

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

    @SipNgInit()
    private _init() {
        if (this._body)
            this._body.height = this.height;
        setTimeout(() => {
            this._nzModal = this._modalSrv.create({
                nzTitle: this._header.content as any,
                nzContent: this._body.content as any,
                nzFooter: this._footer.content as any,
                nzMaskClosable: false,
                nzWidth: this.width
            });
            this._nzModal.afterClose.subscribe((p)=>{
                this._nzModal = null;
                if (this.$isDestroyed) return;
                this.$business.$publish('ModalComponent.onDestroy');
            });

        }, 1);
    }

    @SipSubscribe('SipModal.Close')
    private _sipClose(p: any) {
        this._nzModal && this._nzModal.destroy();
    }

    @SipNgDestroy()
    private _destroy() {
        this._nzModal = null;
        this._header = this._body = this._footer = null;
    }

}
