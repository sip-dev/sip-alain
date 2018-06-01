import { Component, Optional } from '@angular/core';
import { SipMenuChildren } from './sip-menu-children';
import { ISipMenuItem } from './sip-menu-item';

@Component({
  selector: 'sip-menu-item-divider',
  template: '',
  styles: []
})
export class SipMenuItemDividerComponent implements ISipMenuItem {

	constructor(
		@Optional() private _parant:SipMenuChildren
	){
		this._parant && this._parant.addChild(this);
	}

  title:string;
  divider = true;

}
