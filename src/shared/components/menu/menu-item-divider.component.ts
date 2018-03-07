import { Component, Optional } from '@angular/core';
import { MenuChildren } from './menu-children';
import { IMenuItem } from './menu-item';

@Component({
  selector: 'sip-menu-item-divider',
  template: '',
  styles: []
})
export class MenuItemDividerComponent implements IMenuItem {

	constructor(
		@Optional() private _parant:MenuChildren
	){
		this._parant && this._parant.addChild(this);
	}

  title:string;
  divider = true;

}
