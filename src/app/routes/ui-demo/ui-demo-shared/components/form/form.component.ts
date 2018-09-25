import { Component, ViewContainerRef } from '@angular/core';
import { SipValidators } from '@core/sip/sip-validators';
import { ISipFormGroup, SipComponent, SipFormGroup, SipFormSubmit, SipFormWatch } from 'sip-alain';
import { DemoModel } from '../../model/demo.model';

@Component({
    selector: 'sip-form',
    templateUrl: './form.component.html',
    styles: []
})
export class FormComponent extends SipComponent {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
        this.form.$watch('num').subscribe((p) => {
            this.$logger.debug('num', p);
        });
        this.form.$watch('region').subscribe((p) => {
            this.$logger.debug('region', p);
        });
        this.form.$watch('num', 'region').subscribe((p) => {
            this.$logger.debug('num or region', p);
        });
        this.form.valueChanges.subscribe((p) => {
            this.$logger.debug('valuechange', p);
        });
        setTimeout(() => {
            this.form.$model.num = "1111";
        }, 1000);
        setTimeout(() => {
            this.form.$model.num = "1111";
        }, 2000);
    }

    @SipFormWatch('this.form', 'num')
    private _watchTest(p){
        this.$logger.debug('_watchTest', p);
    }

    @SipFormWatch('this.form', 'num', 'region')
    private _watchTest2(p){
        this.$logger.debug('_watchTest2', p);
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
