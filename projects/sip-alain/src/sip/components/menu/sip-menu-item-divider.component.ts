import { Component, Optional } from '@angular/core';
import { ISipMenuItem } from '../../base/i-sip-menu-item';
import { SipMenuChildren } from './sip-menu-children';

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
