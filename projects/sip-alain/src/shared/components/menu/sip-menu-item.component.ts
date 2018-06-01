import { Component, Input, Optional, EventEmitter, Output } from '@angular/core';
import { SipMenuChildren } from './sip-menu-children';
import { ISipMenuItem } from './sip-menu-item';

@Component({
	selector: 'sip-menu-item',
	template: '',
	styles: []
})
export class SipMenuItemComponent implements ISipMenuItem {

	constructor(
		@Optional() private _parant:SipMenuChildren
	){
		this._parant && this._parant.addChild(this);
	}

	@Input() selected = false;
	@Input() title = '';
	@Input() icon = '';
	@Input() disabled = false

	@Output() click: EventEmitter<ISipMenuItem> = new EventEmitter<ISipMenuItem>();

	onClick(item:ISipMenuItem){
		this.click.emit(item);
	}
}
