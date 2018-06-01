import { Component, Input, Optional, SkipSelf, forwardRef } from '@angular/core';
import { SipMenuChildren } from './sip-menu-children';
import { ISipMenuItem } from './sip-menu-item';

@Component({
	selector: 'sip-menu-group',
	template: '',
	styles: [],
	providers:[{ provide: SipMenuChildren, useExisting: forwardRef(() => SipMenuGroupComponent) }]
})
export class SipMenuGroupComponent implements SipMenuChildren, ISipMenuItem {

	constructor(
		@Optional() @SkipSelf() private _parant:SipMenuChildren
	){
		this._parant && this._parant.addChild(this);
	}

	@Input() title = '';
	@Input() icon = '';
	@Input() disabled = false
	group = true;

	children:ISipMenuItem[] = [];
	addChild(menu:ISipMenuItem){
		this.children.push(menu);
	}

}
