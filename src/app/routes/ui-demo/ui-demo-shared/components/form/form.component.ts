import { Component, ViewContainerRef } from '@angular/core';
import { SipComponent, SipNgInit } from 'sip-alain';

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

}
