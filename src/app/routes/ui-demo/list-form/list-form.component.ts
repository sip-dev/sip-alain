import { Component, ViewContainerRef } from '@angular/core';
import { SipFormSubmit, SipModal, SipNgInit, SipOnShow, SipProvideModals } from 'sip-alain';

@Component({
    selector: 'sip-list-form',
    templateUrl: './list-form.component.html',
    styles: [],
    providers: [...SipProvideModals(ListFormComponent)]
})
export class ListFormComponent extends SipModal {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    params = { id: '', datas: null };
    loading = false;

    //等效于ngOnInit, 但可以多次使用
    @SipNgInit()
    private _init() {
        this.params = this.$params(this.params);
        // if (this.params.datas)
        //     this.form.$model = this.params.datas;
    }

    @SipOnShow()
    private _show() {
        console.log('_show');
    }

    @SipFormSubmit('this.form')
    save() {
        // let datas = this.form.$toJSONObject();
        // this.loading = true;
        // console.log('datas', datas);
        // setTimeout(() => {
        //     this.loading = false;
        //     this.$close(true);
        // }, 400);
    }

}