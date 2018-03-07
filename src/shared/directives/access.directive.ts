import { Directive, Optional, Input, HostBinding, ElementRef } from '@angular/core';
import { SipBusinessComponent, SipAccessManager } from '../../core/extends/sip-helper';

@Directive({
    selector: '[sipAccess]'
})
export class AccessDirective {

    constructor(
        @Optional() private _business: SipBusinessComponent,
        el: ElementRef) {
        this._element = el.nativeElement;
        this._access = this._business && this._business.$access;
    }

    _element: HTMLElement;
    _access: SipAccessManager;

    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // this._checkAccess();
        this._initAccess();
        this._checkAccess();
    }

    private _key: string;
    public get key(): string {
        return this._key;
    }
    @Input('sipAccess')
    public set key(p: string) {
        this._key = p;
    }

    private _subs: any;
    private _unsubscribe() {
        if (this._subs) {
            this._subs.unsubscribe();
            this._subs = null;
        }
    }

    private _checkAccess() {
        let key = this._key;
        if (!key) return;
        let acItem = this._access.getAccess(key);
        let checkOk: boolean = acItem ? this._access.hasAccess(key) : false;
        if (this._preCheckOk === checkOk) return;
        this._preCheckOk = checkOk;

        let notPassClass = acItem && acItem.notPassClass || 'disabled';
        notPassClass || (notPassClass = 'disabled');

        let type = acItem && acItem.type;
        type || (type = 'enabled');

        if (checkOk) {
            if (type == 'show')
                this._show(true);
            else {
                if (/^(?:input|button)$/i.test(this._element.tagName))
                    this._element['disabled'] = false;
                else
                    this._element.classList.remove(notPassClass);
            }
        } else {
            if (type == 'show')
                this._show(false);
            else {
                if (/^(?:input|button)$/i.test(this._element.tagName))
                    this._element['disabled'] = true;
                else
                    this._element.classList.add(notPassClass);
            }
        }
    }

    private _preCheckOk: boolean;
    private _initAccess() {
        let key = this._key;
        if (!key) return;
        let access = this._access;
        if (access) {
            this._subs = access.accessSubject.subscribe((datas: any[]) => {
                this._checkAccess();
            });
        }
    }

    private _displayFirst: any = '_dd_';
    private _show(show: boolean) {
        if (this._displayFirst == '_dd_') {
            let display = this._element.style.display;
            if (/none/i.test(display)) display = '';
            this._displayFirst = display || '';
        }
        console.log('display', show);
        this._element.style.display = show ? this._displayFirst : 'none';
    }

    ngOnDestroy() {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this._access = null;
        this._unsubscribe();
    }

}
