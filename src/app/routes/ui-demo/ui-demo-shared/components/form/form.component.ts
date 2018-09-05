import { Component, ViewContainerRef } from '@angular/core';
import { SipValidators } from '@core/sip/sip-validators';
import { ISipFormGroup, SipComponent, SipFormGroup, SipFormSubmit } from 'sip-alain';
import { DemoModel } from '../../model/demo.model';

@Component({
    selector: 'sip-form',
    templateUrl: './form.component.html',
    styles: []
})
export class FormComponent extends SipComponent {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    @SipFormGroup((target: FormComponent) => {
        return {
            model: {
                "num": "",
                "name": "",
                "status": "success",
                "region": "测试云",
                "ip": "",
                "spec": "2核2G",
                "user": "test",
                "date": new Date(),
                "dateRang": "",
                "remark": "",
                "weight": ""
            },
            validators: {
                num: [SipValidators.rangeLength(1, 20)],
                name: [SipValidators.required]
            },
            extra: null
        };
    })
    form: ISipFormGroup<DemoModel>;

    statuList = [
        { text: '成功', value: 'success' },
        { text: '处理中', value: 'processing' },
        { text: '失败', value: 'error' }
    ];

    versionList = [
        { version: '1.0' },
        { version: '2.0' }
    ];

    @SipFormSubmit({ form: 'this.form', message: true })
    getSaveData(): object {
        return null;
        return this.form.$toJSONObject();
    }
}
