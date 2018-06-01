import { Component, ViewContainerRef, forwardRef } from '@angular/core';
import { SipModal, SipNgInit, SipFormGroup, ISipFormGroup, SipBusinessComponent, SipFormSubmit, SipRestDef, SipRestMethod, SipRestFunction, SipRestDictDef, SipRestDictFunction, SipOnShow } from 'sip-alain';
import { SipValidators } from '@core/sip/sip-validators';

@Component({
    selector: 'sip-list-form',
    templateUrl: './list-form.component.html',
    styles: [],
    providers: [{ provide: SipBusinessComponent, useExisting: forwardRef(() => ListFormComponent) }]
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
        if (this.params.datas)
            this.form.$model = this.params.datas;
    }

    @SipOnShow()
    private _show() {
        console.log('_show');
    }

    @SipFormGroup({
        "num": "",
        "name": "",
        "status": "success",
        "region": "测试云",
        "ip": "",
        "spec": "2核2G",
        "user": "test",
        "date": "2017-11-15"
    }, {
            num: [SipValidators.rangeLength(1, 20)],
            name: [SipValidators.required]
        })
    form: ISipFormGroup<any>;

    statuList = [
        { text: '成功', value: 'success' },
        { text: '处理中', value: 'processing' },
        { text: '失败', value: 'error' }
    ];

    versionList = [
        { version: '1.0' },
        { version: '2.0' }
    ];

    @SipFormSubmit('this.form')
    save() {
        let datas = this.form.$toJSONObject();
        this.loading = true;
        console.log('datas', datas);
        setTimeout(() => {
            this.loading = false;
            this.$close(true);
        }, 400);
    }

}