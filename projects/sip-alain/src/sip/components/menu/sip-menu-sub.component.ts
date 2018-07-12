import { Component, forwardRef, Input, Optional, SkipSelf } from '@angular/core';
import { ISipMenuItem } from '../../base/i-sip-menu-item';
import { SipMenuChildren } from './sip-menu-children';

@Component({
	selector: 'sip-menu-sub',
	template: '',
	styles: [],
	providers:[{ provide: SipMenuChildren, useExisting: forwardRef(() => SipMenuSubComponent) }]
})
export class SipMenuSubComponent implements SipMenuChildren, ISipMenuItem {

	constructor(
		@Optional() @SkipSelf() private _parant:SipMenuChildren
	){
		this._parant && this._parant.addChild(this);
	}

	@Input() open = false;//	submenu是否展开，可双向绑定	Boolean		false
	@Input() title = '';//	ng-content标示，用于放置submenu title内容
	@Input() icon = '';
	@Input() disabled = false

	children:ISipMenuItem[] = [];
	addChild(menu:ISipMenuItem){
		this.children.push(menu);
	}
}
