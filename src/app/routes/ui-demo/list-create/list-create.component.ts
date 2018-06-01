import { Component, ViewContainerRef, forwardRef } from '@angular/core';
import { SipPage, SipNgInit, SipOnShow, SipBusinessComponent, SipFormGroup, ISipFormGroup, SipFormSubmit } from 'sip-alain';
import { SipValidators } from '@core/sip/sip-validators';

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
    securityoptions = [];

    //等效于ngOnInit, 但可以多次使用
    @SipNgInit()
    private _init() {
        this.params = this.$params(this.params);
        if (this.params.datas)
            this.form.$model = JSON.parse(this.params.datas);
    }

    @SipOnShow()
    private _show() {
        console.log('_show');
    }

    @SipFormGroup({
        "edition": "2.0.0",
        "architecture": "A",
        "installuser": "success",
        "password": "测试云",
        "name": "",
        "projects": "region01",
        "region": "region01",
        "networks": "test",
        "specification":"master01",
        "security":"",
        "date": "2017-11-15"
    }, {
            num: [SipValidators.rangeLength(1, 20)],
            name: [SipValidators.required]
        })
    form: ISipFormGroup<any>;

	// 版本
	editionoptions = [
		{ value: '2.0.0', label: '2.0.0' },
		{ value: '1.3.3', label: '1.3.0' },
		{ value: '1.0.2', label: '1.0.2', disabled: true }
	]

	// 项目
	projectsoptions = [
		{ value: 'region01', label: '广州市品高软件股份有限公司' },
		{ value: 'region02', label: '生产环境' },
		{ value: 'region03', label: '测试环境' }
	]

	// 区域
	areaoptions = [
		{ value: 'project01', label: '广州' },
		{ value: 'project02', label: '上海' },
		{ value: 'project03', label: '北京' }
	]

	// 网络
	networksoptions = [
		{ value: 'none', label: '无可用网络' }
	]

	// 小规格
	smspecification = [
		{ name: "master01", id:"SPI", spec:"2核、2G、100G" },
		{ name: "master02", id:"SPI", spec:"2核、2G、100G" },
		{ name: "master03", id:"SPI", spec:"2核、2G、100G" }
	]

    @SipFormSubmit('this.form')
    save() {
        let datas = this.form.$toJSONObject();
        this.loading = true;
        console.log('datas', datas);
        setTimeout(() => {
            this.loading = false;
            this.$close(true);
        }, 400);
        return;
    }

}