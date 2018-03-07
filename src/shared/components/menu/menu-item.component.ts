import { Component, Input, Optional, EventEmitter, Output } from '@angular/core';
import { MenuChildren } from './menu-children';
import { IMenuItem } from './menu-item';

@Component({
	selector: 'sip-menu-item',
	template: '',
	styles: []
})
export class MenuItemComponent implements IMenuItem {

	constructor(
		@Optional() private _parant:MenuChildren
	){
		this._parant && this._parant.addChild(this);
	}

	@Input() selected = false;
	@Input() title = '';
	@Input() icon = '';
	@Input() disabled = false

	@Output() click: EventEmitter<IMenuItem> = new EventEmitter<IMenuItem>();

	onClick(item:IMenuItem){
		this.click.emit(item);
	}
}
