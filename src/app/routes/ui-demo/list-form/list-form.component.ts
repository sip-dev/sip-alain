import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { SipModal, SipNgDestroy, SipNgInit, SipProvideModals } from 'sip-alain';
import { FormComponent } from '../ui-demo-shared/components/form/form.component';

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
    @ViewChild('form1') form1:FormComponent;

    //等效于ngOnInit, 但可以多次使用
    @SipNgInit()
    private _init() {
        console.log('_init')
        this.params = this.$params(this.params);
        // if (this.params.datas)
            this.form1.form.$model = this.params.datas;
    }

    @SipNgDestroy()
    private _destroy() {
        console.log('_destroy');
    }

    save() {
        let datas = this.form1.getSaveData();
        if (!datas) return;
        this.loading = true;
        console.log('datas', datas);
        setTimeout(() => {
            this.loading = false;
            this.$close(true);
        }, 400);
        return;
    }

}