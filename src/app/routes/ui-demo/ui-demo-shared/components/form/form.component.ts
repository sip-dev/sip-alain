import { Component, ViewContainerRef } from '@angular/core';
import { SipValidators } from '@core/sip/sip-validators';
import { ISipFormGroup, SipComponent, SipFormGroup, SipNgInit } from 'sip-alain';

@Component({
	selector: 'sip-form',
	templateUrl: './form.component.html',
	styles: []
})
export class FormComponent extends SipComponent {

	constructor(vcf: ViewContainerRef) {
		super(vcf);
	}

	@SipNgInit()
	private _init() {
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

	getSaveData():object{
		return this.form.$toJSONObject();
	}
}
