import { Component, ContentChild, Input, ViewContainerRef, Optional } from '@angular/core';
import { NzModalService, NzModalSubject } from 'ng-zorro-antd';
import { ModalHeaderComponent } from './modal-header.component';
import { ModalBodyComponent } from './modal-body.component';
import { ModalFooterComponent } from './modal-footer.component';
import { Observable } from 'rxjs/Observable';
import { SipComponent, SipInject, SipNgInit, SipSubscribe, SipNgDestroy } from '../../../core/extends/sip-helper';

@Component({
    selector: 'sip-modal',
    template: `<ng-content></ng-content>`,
    styles: []
})
export class ModalComponent extends SipComponent {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
        this.$business.$publish('SipModal.Set', this);
    }

    @SipInject(NzModalService)
    private _modalSrv: NzModalService

    @ContentChild(ModalHeaderComponent) _header: ModalHeaderComponent;
    @ContentChild(ModalBodyComponent) _body: ModalBodyComponent;
    @ContentChild(ModalFooterComponent) _footer: ModalFooterComponent;

    private _nzModal: NzModalSubject;

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
            this._nzModal = this._modalSrv.open({
                title: this._header.content as any,
                content: this._body.content as any,
                footer: this._footer.content as any,
                maskClosable: false,
                width: this.width
            });
            this._nzModal.on('onDestroy', () => {
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
