import { Component, Input, forwardRef, Optional, SkipSelf, group } from '@angular/core';
import { MenuChildren } from './menu-children';
import { IMenuItem } from './menu-item';

@Component({
	selector: 'sip-menu-group',
	template: '',
	styles: [],
	providers:[{ provide: MenuChildren, useExisting: forwardRef(() => MenuGroupComponent) }]
})
export class MenuGroupComponent implements MenuChildren, IMenuItem {

	constructor(
		@Optional() @SkipSelf() private _parant:MenuChildren
	){
		this._parant && this._parant.addChild(this);
	}

	@Input() title = '';
	@Input() icon = '';
	@Input() disabled = false
	group = true;

	children:IMenuItem[] = [];
	addChild(menu:IMenuItem){
		this.children.push(menu);
	}

}
