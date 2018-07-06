import { Injector, ViewContainerRef, ViewRef } from '@angular/core';
import { Lib } from 'sip-lib';
import { ISipMenuItem } from '../../shared/components/menu/sip-menu-item';
import { SipAppContainerService } from '../services/sip-app-container.service';

export interface IContextMenu {
    width?: string;
    items: ISipMenuItem[];
}

export class SipContextmenu {

    private _appCTS: SipAppContainerService;
    private _menuFactory: () => IContextMenu;
    constructor(p: ViewContainerRef | Injector, menuFactory: () => IContextMenu) {
        let vcf:ViewContainerRef = p as ViewContainerRef;
        let injector: Injector = vcf.injector ? vcf.injector : p as Injector;
        this._appCTS = injector.get(SipAppContainerService);
        this._menuFactory = menuFactory;
    }

    show(e: MouseEvent, arg?:any): boolean {
        e.preventDefault();
        e.stopPropagation();
        let menu: IContextMenu = this._menuFactory ? this._menuFactory() : { items: null };
        if (!menu.items || !menu.items.length) return false;
        if (!menu.width) menu.width = '140px';
        menu.items.forEach((item)=>{item.arg = arg})

        let offset = Lib.offset(document.body);
        let left = (e.pageX - offset.left) + 'px';
        let top = (e.pageY - offset.top) + 'px';

        document.documentElement.addEventListener('mousedown', this._doc_mousedown);
        this._container = this._appCTS.appendTemplate(this._appCTS._contextmenu, {
            left: left,
            top: top,
            menu: menu,
            mousedown:this._mousedown,
            click:this._click
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
        document.documentElement.removeEventListener('mousedown', this._doc_mousedown);
        if (this._container) {
            this._container.destroy();
            this._container = null;
        }
    }
}
