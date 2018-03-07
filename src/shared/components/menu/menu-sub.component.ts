import { Component, EventEmitter, Input, Output, forwardRef, Optional, SkipSelf } from '@angular/core';
import { MenuChildren } from './menu-children';
import { IMenuItem } from './menu-item';

@Component({
	selector: 'sip-menu-sub',
	template: '',
	styles: [],
	providers:[{ provide: MenuChildren, useExisting: forwardRef(() => MenuSubComponent) }]
})
export class MenuSubComponent implements MenuChildren, IMenuItem {

	constructor(
		@Optional() @SkipSelf() private _parant:MenuChildren
	){
		this._parant && this._parant.addChild(this);
	}

	@Input() open = false;//	submenu是否展开，可双向绑定	Boolean		false
	@Input() title = '';//	ng-content标示，用于放置submenu title内容
	@Input() icon = '';
	@Input() disabled = false

	children:IMenuItem[] = [];
	addChild(menu:IMenuItem){
		this.children.push(menu);
	}
}
