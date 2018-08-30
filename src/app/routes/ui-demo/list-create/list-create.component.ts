import { Component, forwardRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SipBusinessComponent, SipNgInit, SipPage } from 'sip-alain';
import { FormComponent } from '../ui-demo-shared/components/form/form.component';

@Component({
    selector: 'sip-list-create',
    templateUrl: './list-create.component.html',
    styles: [],
    providers: [{ provide: SipBusinessComponent, useExisting: forwardRef(() => ListCreateComponent) }]
})
export class ListCreateComponent extends SipPage {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    params = { id: '', datas: null };
    loading = false;
    @ViewChild('form1') form1:FormComponent;

    //等效于ngOnInit, 但可以多次使用
    @SipNgInit()
    private _init() {
        this.params = this.$params(this.params);
        if (this.params.datas)
            this.form1.form.$model = JSON.parse(this.params.datas);
    }

    save() {
        let datas = this.form1.getSaveData();
        if (!datas)return;
        this.loading = true;
        console.log('datas', datas);
        setTimeout(() => {
            this.loading = false;
            this.$close(true);
        }, 400);
        return;
    }

}