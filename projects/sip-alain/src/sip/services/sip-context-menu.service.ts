import { Injectable, Injector, TemplateRef, ViewRef } from '@angular/core';
import { ISipContextMenu } from '../base/i-sip-context-menu';
import { SipAppContainerService } from './sip-app-container.service';

@Injectable()
export class SipContextMenuService {

  private _appCTS: SipAppContainerService;
  constructor(injector: Injector) {
    this._appCTS = injector.get(SipAppContainerService);
  }

  show(contextmenu: ISipContextMenu, e: MouseEvent, tmpl?:TemplateRef<any>): boolean {
    e.preventDefault();
    e.stopPropagation();

    // let offset = Lib.offset(document.body);
    let offset = document.documentElement.getBoundingClientRect();
    let left = e.pageX + offset.left;
    let top = e.pageY + offset.top;

    return this.showByPos(contextmenu, top, left, tmpl);

  }

  showByPos(contextmenu: ISipContextMenu, top: number, left: number, tmpl?:TemplateRef<any>): boolean {
    if (!tmpl && (!contextmenu.items || !contextmenu.items.length)) return false;
    if (!contextmenu.width) contextmenu.width = 'auto';

    this.hide();
    document.documentElement.addEventListener('mousedown', this._doc_mousedown);
    // document.documentElement.addEventListener('mousewheel', this._doc_mousedown);
    this._container = this._appCTS.appendTemplate(this._appCTS._contextmenu, {
      left: left + 'px',
      top: top + 'px',
      menu: contextmenu,
      mousedown: this._mousedown,
      click: this._click,
      tmpl:tmpl
    });
    return false;
  }

  private _doc_mousedown = () => {
    this.hide();
  };

  private _mousedown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  private _click = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.hide();
    return false;
  };

  _container: ViewRef;

  hide() {
    if (this._container) {
      document.documentElement.removeEventListener('mousedown', this._doc_mousedown);
      // document.documentElement.removeEventListener('mousewheel', this._doc_mousedown);
      this._container.destroy();
      this._container = null;
    }
  }

}
