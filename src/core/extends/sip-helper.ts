import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ComponentFactoryResolver, ComponentRef, DoCheck, EventEmitter, Injector, OnChanges, OnDestroy, OnInit, TemplateRef, Type, ViewContainerRef, ViewRef } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
import { ReuseTabService } from "@delon/abc";
import { Menu, MenuService } from "@delon/theme";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import { map } from 'rxjs/operators';
import { Lib, breakOff } from 'sip-lib';
import { SipAppContainerService } from '../services/sip-app-container.service';
import { SipEventService } from '../services/sip-event.service';
import { ISipRestDict, SipHttpOptions, SipRestRet, SipRestService, SipRestSqlRet } from '../services/sip-rest.service';
import { SipAlainConfig } from './sip-alain-config';

let undef;

//region equals

let _equalArrayIn = function (array1: Array<any>, array2: Array<any>) {
    var ok = true;
    Lib.each(array1, function (item, index) {
        if (item != array2[index]) {
            ok = false; return false;
        }
    });
    return ok;

}, _equalArray = function (array1: Array<any>, array2: Array<any>): boolean {
    if ((!array1 || !array2)) return array1 == array2;

    return array1.length == array2.length && _equalArrayIn(array1, array2);

}, _equalObject = function (obj1, obj2) {
    if (obj1 == obj2) return true;
    if (!Lib.isObject(obj2)) return false;

    var count = 0, ok = true;
    Lib.eachProp(obj1, function (item, n) {
        count++;
        if (obj2[n] !== item) { ok = false; return false; }
    });
    ok && Lib.eachProp(obj2, function () {
        count--;
    });
    return ok && (count === 0);

}, _equals = function (p, p1) {
    if (Lib.isArray(p))
        return _equalArray(p, p1);
    else if (Lib.isObject(p))
        return _equalObject(p, p1);
    else
        return p == p1;
}

//endregion equals

// region watch

let _getWatchContext = function (owner, name) {
    let context = owner._$sipWatch;
    context || (context = owner._$sipWatch = {});
    return context[name] || (context[name] = []);
};
let _setWatchContext = function (owner, name, values) {
    owner._$sipWatch[name] = values;
};

let _pushWatch = function (target: any, args: any[], watchFn: Function) {
    if (args.length == 0) return;
    let watchList = [];
    Lib.each(args, function (item) {
        if (Lib.isArray(item)) {
            let tL = [];
            Lib.each(item, function (item) {
                tL.push(Lib.isString(item) ? new Function(['return ', item].join('')) : item);
            });
            watchList.push(tL);
        }
        else
            watchList.push(Lib.isString(item) ? new Function(['return ', item].join('')) : item);
    });

    let name = Lib.makeAutoId();
    _pushEvent(target, 'ngDoCheck', function () {
        let values = _getWatchContext(this, name);
        let isInit = values.length > 0;
        let fn = watchFn,
            isC = false,
            res = [];
        Lib.each(watchList, function (item, idx) {
            let val = values[idx], newVal;
            if (Lib.isArray(item)) {
                if (item.length > 0) {
                    let newValList = [];
                    val || (val = []);
                    let isCLi = true;
                    Lib.each(item, function (item, idx) {
                        newVal = item.call(this);
                        isCLi && (isCLi = !_equals(val[idx], newVal));
                        newValList.push(newVal);
                    }, this);
                    isC || (isC = isCLi);
                    res.push(newValList);
                }
            } else {
                newVal = item.call(this);
                isC || (isC = (!_equals(val, newVal)));
                res.push(newVal);
            }
        }, this);
        if (isC) {
            _setWatchContext(this, name, res);
            isInit && fn.apply(this, res);
        }
    });
};
/**
 * 观察，只能用于Component
 * @param args 观察对象，可以字串、数组和方法
 * @example SipWatch('this.title', ['this.title1', 'this.title2'])
 */
export function SipWatch(...args: any[]) {
    return function (target: any, propKey: string) {
        _pushWatch(target, args, target[propKey]);
    };
}

// endregion watch

// region component events

/**_pushSipEvent(target, '$onShow', target[propKey]) */
let _pushSipEvent = function (target: any, eventName: string, newFn: Function) {

    _pushEvent(target, 'sipOnConstructor', function () {
        this[eventName] && this[eventName].subscribe(() => { newFn.call(this); });
    });

};

/**UI $onShow事件， 用于在SipNgInit处理rest加载数据后的事件 */
export function SipOnShow() {
    return function (target: any, propKey: string) {
        _pushSipEvent(target, '$onShow', target[propKey]);
    };
};


/**_pushEvent(target, 'ngOnInit', target[propKey]) */
let _pushEvent = function (target: any, eventName: string, newFn: Function) {

    let oldFn = target[eventName];
    target[eventName] = function () {
        oldFn && oldFn.apply(this, arguments);
        newFn && newFn.apply(this, arguments);
    };
};

/**
 * 在Angular第一次显示数据绑定和设置指令/组件的输入属性之后，初始化指令/组件。在第一轮EventChange()完成之后调用，只调用一次。
 */
export function SipNgInit() {
    let a;
    return function (target: any, propKey: string) {
        _pushEvent(target, 'ngOnInit', target[propKey]);
    };
}

/**
 * 检测，并在发生Angular无法或不愿意自己检测的变化时作出反应。在每个Angular变更检测周期中调用，EventChange()和EventInit()之后。
 */
export function SipNgCheck() {
    let a;
    return function (target: any, propKey: string) {
        _pushEvent(target, 'ngDoCheck', target[propKey]);
    };
}

/**
 * 当Angular（重新）设置数据绑定输入属性时响应。 该方法接受当前和上一属性值的SimpleChanges对，当被绑定的输入属性的值发生变化时调用，首次调用一定会发生在EventInit()之前。
 */
export function SipNgChange() {
    let a;
    return function (target: any, propKey: string) {
        _pushEvent(target, 'ngOnChanges', target[propKey]);
    };
}

/**
 * 当把内容投影进组件之后调用。第一次EventCheck()之后调用，只调用一次。只适用于组件。
 */
export function SipNgAfterContentInit() {
    let a;
    return function (target: any, propKey: string) {
        _pushEvent(target, 'ngAfterContentInit', target[propKey]);
    };
}

/**
 * 每次完成被投影组件内容的变更检测之后调用。EventAfterContentInit()和每次EventCheck()之后调用，只适合组件。
 */
export function SipNgAfterContentChecked() {
    let a;
    return function (target: any, propKey: string) {
        _pushEvent(target, 'ngAfterContentChecked', target[propKey]);
    };
}

/**
 * 初始化完组件视图及其子视图之后调用。第一次EventAfterContentChecked()之后调用，只调用一次。只适合组件。
 */
export function SipNgAfterViewInit() {
    let a;
    return function (target: any, propKey: string) {
        _pushEvent(target, 'ngAfterViewInit', target[propKey]);
    };
}

/**
 * 每次做完组件视图和子视图的变更检测之后调用。EventAfterViewInit()和每次EventAfterContentChecked()之后调用。只适合组件。
 */
export function SipNgAfterViewChecked() {
    let a;
    return function (target: any, propKey: string) {
        _pushEvent(target, 'ngAfterViewChecked', target[propKey]);
    };
}

/**
 * 当Angular每次销毁指令/组件之前调用并清扫。 在这儿反订阅可观察对象和分离事件处理器，以防内存泄漏。在Angular销毁指令/组件之前调用。
 */
export function SipNgDestroy() {
    let a;
    return function (target: any, propKey: string) {
        _pushEvent(target, 'ngOnDestroy', target[propKey]);
    };
}


// endregion component events

//#region SipSubscribe

export interface ISipSubscribeParams {
    /**订阅成功内容 */
    success?: boolean;
    /**订阅失败内容 */
    error?: boolean;
    /**订阅完成内容 */
    complete?: boolean;
}

let _pushSubscribe = function (target: any, event: string, params: ISipSubscribeParams, fn: any) {
    _pushEvent(target, 'sipOnConstructor', function () {
        let tFn = function () {
            fn.apply(this, arguments);
        }.bind(this);
        this.$subscribe(event, params.success ? tFn : null, params.error ? tFn : null, params.complete ? tFn : null);
    });
};

/**
 * 订阅, 可以用于service
 * @param event 事件名称
 * @param params 参数
 * @example SipSubscribe('test-list.testsubs') 
 */
export function SipSubscribe(event: string, params?: ISipSubscribeParams) {
    params || (params = { success: true });
    return function (target: any, propKey: string) {
        _pushSubscribe(target, event, params, target[propKey]);
    };
}

//#endregion SipSubscribe

//#region SipInject

export interface ISipInjectParams {
    /**自动释放，结合Componey.ngOnDestroy */
    autoDestroy?: boolean;
    /**injector.get notFoundValue参数 */
    notFoundValue?: any;
}

/**
 * 定义一个注入服务, 可以用于service
 * @param token 注入tokey
 * @param params 参数
 * @example SipInject(TestServcie, { autoDestroy: true })
 */
export function SipInject(token: any, params?: ISipInjectParams) {
    let a;
    return function (target: any, propKey: string) {
        Object.defineProperty(target, propKey, {
            configurable: false,
            enumerable: true,
            get: function () {
                return this.$injector(token, params);
            },
            set: function (value) { }
        });
    };
}

//#endregion SipInject

//#region SipAccess

export interface ISipAccessParams<T=object> {
    /**是否可以多个数据, 默认false */
    multi?: boolean;
    /**是否要有数据, 默认false */
    hasData?: boolean;
    /**处理类型：show|enabled, 默认enabled */
    type?: 'enabled' | 'show';
    /**检查不通过时添加样式 */
    notPassClass?: string;
    /**
     * 检查数据
     * @param datas 传入的数据
     */
    check?: (this: T, datas: any[]) => boolean;
};

export interface ISipAccessManager<T> {
    acl?: any;
    /**UI的出入口 */
    access?: { [key: string]: ISipAccessParams<T> }
}

/**
 * 定义UI出入口SipAccessManager，只能SipBusinessComponent可以用，如：Page或Modal用
 * @param key key
 * @param params 参数
 * @example SipAccess({ access: { hasData: true } })
 */
export function SipAccess<T=object>(params?: { [key: string]: ISipAccessParams<T> }) {
    return function (target: any, propKey: string) {
        let _oldFn = target[propKey], _has = false;
        _pushEvent(target, 'sipOnConstructor', function () {
            let aP;
            if (params) {
                aP = {}
                Lib.eachProp(params, function (item, name) {
                    item = Lib.extend({}, item);
                    let _oldFn = item.check;
                    if (_oldFn) {
                        item.check = function () { return _oldFn.apply(this, arguments); }.bind(this);
                    }
                    item.check && item.check
                    aP[name] = item;
                }, this);
            }
            let access: SipAccessManager = this.$access;
            if (!access)
                this.$access = access = new SipAccessManager({ access: aP });
            else if (aP) {
                access.extend({ access: aP })
            }
        });
        Object.defineProperty(target, propKey, {
            configurable: false,
            get: function () {
                return this.$access;
            }
        });
    };
}

/**
 * 定义UI出入口，只能SipBusinessComponent可以用，如：Page或Modal用
 * @param key key
 * @param params 参数
 * @example SipAccessItem<TestListComponent>('create', { hasData: true })
 */
export function SipAccessItem<T=object>(key: string, params?: ISipAccessParams<T>) {
    let _checkFn = params && params.check;

    return function (target: any, propKey: string) {
        let _oldFn = target[propKey], _has = false;
        _pushEvent(target, 'ngOnInit', function () {
            let access: SipAccessManager = this.$access;
            if (access && params) {
                _has = true;
                let pp: any = Lib.extend({}, params);
                pp.check = function () {
                    return _checkFn && _checkFn.apply(this, arguments);
                }.bind(this);
                let acItem = {};
                acItem[key] = pp;
                access.extend({ access: acItem });
            }
            this[propKey] = function () {
                if (_has && !access.hasAccess(key)) return;
                _oldFn && _oldFn.apply(this, arguments);
            };
        });
    };
}

/**UI的出入口管理类 */
export class SipAccessManager {

    readonly access: { [key: string]: ISipAccessParams } = {};
    readonly acl: any = {};

    constructor(p: ISipAccessManager<any>) {
        this.extend(p);
    }

    /**
     * 扩展
     * @param p 
     */
    public extend(p: ISipAccessManager<any>) {
        if (p.access)
            Lib.extend(this.access, p.access);
        if (p.acl)
            Lib.extend(this.acl, p.acl);
    }

    private _datas: any[];
    public get datas(): any[] {
        return this._datas;
    }
    public set datas(p: any[]) {
        this._datas = p;
        this.check();
    }

    public accessSubject: Subject<any[]> = new Subject<any[]>();

    /**
     * 检查数据
     * @param datas 传入的数据
     */
    public check(datas?: any[]) {
        if (arguments.length > 0)
            this._datas = datas;
        this.accessSubject.next(this._datas);
    }

    /**
     * 获取Access
     * @param key
     */
    public getAccess(key: string) {
        let access = this.access;
        return access && access[key];
    }

    /**是否有Access */
    public hasAccess(key: string): boolean {
        let acItem = this.getAccess(key);
        if (!acItem) return false;
        let datas = this._datas;
        let checkOk: boolean;
        if (acItem.hasData) {
            if (!datas || datas.length == 0)
                checkOk = !acItem.hasData;
            else {
                checkOk = acItem.multi || datas.length == 1;
            }
        } else
            checkOk = true;
        if (checkOk && acItem.check) checkOk = acItem.check(datas);
        return checkOk;
    }
}

//#endregion SipAccess

//#region SipUiLink

export class SipUiLink {
    constructor(public opener: SipBusinessComponent) { }
    public owner: SipBusinessComponent;
    private _subs: Subject<any> = new Subject<any>();
    subscribe(callback: (r: any) => void): SipUiLink {
        if (this.opener && !this.opener.$isDestroyed)
            this._subs.subscribe(callback);
        return this;
    }
    publish(p: any): SipUiLink {
        if (this.opener && !this.opener.$isDestroyed)
            this._subs.next(p);
        return this;
    }
    close() {
        this.owner && !this.owner.$isDestroyed && this.owner.$close();
        this.destory();
    }
    get isDestory(): boolean {
        return !this._subs;
    }
    destory() {
        this.owner = this._subs = this.opener = null;
    }
}
let _navigateLinks = [], _navigateLinkId = 0, _navigateLinkMax = 9;
let _createNavigateLink = function (opener: any, params: any): SipUiLink {
    let id = ++_navigateLinkId;
    params._L = id;
    let link = new SipUiLink(opener);
    _navigateLinks[id] = link;
    _navigateLinkId >= _navigateLinkMax && (_navigateLinkId = 0);
    return link;
};
let _getNavigateLink = function (params: any): SipUiLink {
    let id = params && params._L;
    let link = id ? _navigateLinks[id] : null;
    link && (_navigateLinks[id] = null);
    return link;
}

//#endregion SipUiLink

//#region SipRestDef

export enum SipRestMethod {
    POST = 'post',
    GET = 'get',
    DELETE = 'delete',
    PUT = 'put'
}

export enum SipRestSqlType {
    PageList = 'PageList',
    List = 'List',
    Execute = 'Execute',
    Insert = 'Insert',
    Entity = 'Entity',
    EntityEx = 'EntityEx'
}

export interface ISipRestDefParamsBase<T> {
    url?: string;
    params?: any;
    httpOptions?: SipHttpOptions;
    /**拥有者，一般是UI，处理释放问题 */
    owner?: any;
    /**是否缓存，必须设置owner */
    cache?: boolean;
    //改造数据
    map?: (rs: SipRestRet<T>) => SipRestRet<T>;
}

export interface ISipRestDefParams<T=any> extends ISipRestDefParamsBase<T> {
    method?: SipRestMethod;
}

export interface SipRestFunction<I, O> {
    (data?: I, options?: ISipRestDefParams<O>): Observable<SipRestRet<O>>;
}

export function SipRestDef<T=any>(params: ISipRestDefParams<T>) {
    return function (target: any, propKey: string) {

        Object.defineProperty(target, propKey, {
            configurable: false,
            get: function () {
                return function (p?: any, options?: any): any {
                    let tempParams: ISipRestDefParams<T> = Lib.extend({}, params, options);
                    let tmplP = Lib.extend({}, params.params, p);
                    tempParams.params = tmplP;
                    let httpSrv: SipRestService = this.$httpSrv;
                    let url = tempParams.url;
                    let method = tempParams.method;
                    let obs: Observable<any>;
                    switch (method) {
                        case SipRestMethod.POST:
                            obs = httpSrv.post(url, tempParams);
                            break;
                        case SipRestMethod.DELETE:
                            obs = httpSrv.delete(url, tempParams);
                            break;
                        case SipRestMethod.PUT:
                            obs = httpSrv.put(url, tempParams);
                            break;
                        case SipRestMethod.GET:
                        default:
                            obs = httpSrv.get(url, tempParams);
                            break;
                    }
                    if (tempParams.map)
                        return obs.pipe(map(tempParams.map));
                    else
                        return obs;
                }.bind(this);
            }
        });
    };
}

export interface ISipRestSqlDefParams<T> extends ISipRestDefParamsBase<T> {
    sqlType?: SipRestSqlType;

    connstr?: string;
    sqlId?: string;
    pageSize?: number;
    pageIndex?: number;
    sortName?: string;
    sortOrder?: '' | 'asc' | 'desc';
    searchparam?: object;
}

export interface SipRestSqlFunction<I, O> {
    (data?: I, options?: ISipRestSqlDefParams<O>): Observable<SipRestSqlRet<O>>;
}

export function SipRestSqlDef<T=any>(params: ISipRestSqlDefParams<T>) {
    return function (target: any, propKey: string) {

        Object.defineProperty(target, propKey, {
            configurable: false,
            get: function () {
                return function (p?: any, options?: any): any {
                    let tempParams: ISipRestSqlDefParams<T> = Lib.extend({}, params, options);
                    tempParams.searchparam = Lib.extend({}, tempParams.searchparam, p);
                    let httpSrv: SipRestService = this.$httpSrv;
                    let url = tempParams.url;
                    let sqlType = tempParams.sqlType;
                    let obs: Observable<any>;
                    switch (sqlType) {
                        case SipRestSqlType.PageList:
                            obs = httpSrv.sql(Lib.extend({ pageSize: 10 }, tempParams));
                            break;
                        case SipRestSqlType.Entity:
                            obs = httpSrv.sqlEntity(tempParams);
                            break;
                        case SipRestSqlType.EntityEx:
                            obs = httpSrv.sqlEntityEx(tempParams);
                            break;
                        case SipRestSqlType.Execute:
                            obs = httpSrv.sqlExecute(tempParams);
                            break;
                        case SipRestSqlType.Insert:
                            obs = httpSrv.sqlInsert(tempParams);
                            break;
                        case SipRestSqlType.List:
                        default:
                            obs = httpSrv.sqlList(Lib.extend({ pageSize: 999 }, tempParams));
                            break;
                    }
                    if (tempParams.map)
                        return obs.pipe(map(tempParams.map));
                    else
                        return obs;
                }.bind(this);
            }
        });
    };
}

export interface ISipRestDictDefParams extends ISipRestDefParamsBase<ISipRestDict[]> {
    code?: string;
    conStr?: string;
}

export interface SipRestDictFunction {
    (options?: ISipRestDictDefParams): Observable<SipRestRet<ISipRestDict[]>>;
}

export function SipRestDictDef<T=any>(params: ISipRestDictDefParams) {
    return function (target: any, propKey: string) {

        Object.defineProperty(target, propKey, {
            configurable: false,
            get: function () {
                return function (options?: any): any {
                    let tempParams: ISipRestDictDefParams = Lib.extend({}, params, options);
                    let tempCode: string = tempParams.code || params.code;
                    let tempConStr: string = tempParams.conStr || params.conStr;

                    let httpSrv: SipRestService = this.$httpSrv;
                    let obs: Observable<any> = httpSrv.dict(tempCode, tempConStr, tempParams);;
                    return obs;
                }.bind(this);
            }
        });
    };
}

//#endregion SipRestDef

/**
 * 提交方法
 * @param form form
 * @example @SipSubmitForm('this.form', 'this.form1')
 */
export function SipFormSubmit(...forms: string[]) {
    let formFnList = forms.map(function (form) { return new Function('return ' + form); });
    return function (target: any, propKey: string) {
        let oldFn = target[propKey];
        _pushEvent(target, 'sipOnConstructor', function () {
            this[propKey] = function () {
                let formList = formFnList.map((formFn) => {
                    return formFn.call(this);
                });
                let valid = true;
                Lib.each(formList, function (form) {
                    for (const i in form.controls) {
                        form.controls[i].markAsDirty();
                    }
                    if (!form.valid) {
                        valid = false;
                        return false;
                    }
                });
                if (!valid) return;
                oldFn.apply(this, arguments);
            };
        });
    };
}

export interface ISipFormGroup<T=any> extends FormGroup {
    $model: T;
    $toJSONObject: () => T
    [key: string]: any;
}

export function SipFormGroup<T>(model: ((this: T) => any) | object, validators?: { [key: string]: any } | ((this: T) => { [key: string]: any }), extra?: { [key: string]: any } | ((this: T) => { [key: string]: any })) {
    return function (target: any, propKey: string) {

        _pushEvent(target, 'sipOnConstructor', function () {
            let valids = {};
            let modelObj = {};
            let modelThis = Lib.isFunction(model) ? (model as Function).call(this) : (model || {});
            let validatorsTemp = Lib.isFunction(validators) ? (validators as Function).call(this) : (validators || {});
            Lib.eachProp(modelThis, function (item, name) {
                if (validatorsTemp[name])
                    valids[name] = [item, validatorsTemp[name]];
                else
                    valids[name] = [item];
                Object.defineProperty(modelObj, name, {
                    enumerable: true, configurable: false,
                    get: function () {
                        return formGroup.get(name).value;
                    },
                    set: function (value) {
                        let obj = {};
                        obj[name] = value;
                        formGroup.patchValue(obj, { onlySelf: true, emitEvent: false });
                    }
                });
            }, this);
            let extraTemp = Lib.isFunction(extra) ? (extra as Function).call(this) : extra;
            let formGroup: FormGroup = this.$formBuilder.group(valids, extraTemp);
            Lib.eachProp(modelThis, function (item, name) {
                Object.defineProperty(formGroup, '$' + name, {
                    enumerable: true, configurable: false,
                    get: function () {
                        return this.controls[name];
                    }
                });
            }, this);
            Object.defineProperty(formGroup, '$model', {
                enumerable: true, configurable: false,
                get: function () {
                    return modelObj;
                },
                set: function (value) {
                    Object.assign(modelObj, value || {});
                }
            });
            Object.defineProperty(formGroup, '$toJSONObject', {
                enumerable: true, configurable: false,
                writable: false,
                value: function () {
                    let obj = Lib.extend({}, this.$model);
                    return obj;
                }
            });
            this[propKey] = formGroup;

        });
        _pushEvent(target, 'ngOnDestroy', function () {
            this[propKey] = null;
        });
    };
}


/**modal传参数时用 */
let _$modalParams: any;

/** Sip Parent 类 */
export class SipParent {

    /**SipNgEvent占用 */
    private _$sipEvents: any;

    constructor(private _$injector: Injector) {
        let $this: any = this;
        $this['sipOnConstructor'] && $this['sipOnConstructor']();
    }

    private _$ijs = [];
    private _$ijTokens = [];
    private _$ijdestroys: SipParent[] = [];

    /**
     *  返回Injector
     * @example let injector:Injector = this.$injector();
     */
    public $injector(): Injector;
    /**
     * 返回注入对象
     * @param token
     * @param params 参数
     * @example let testSrv:TestService = this.$injector(TestService);
     */
    public $injector(token: any, params?: ISipInjectParams): any;
    public $injector(token?: any, params?: ISipInjectParams): any {
        if (arguments.length) {
            if (!this._$ijTokens) return null;
            let index = this._$ijTokens.indexOf(token);
            if (index > -1)
                return this._$ijs[index];
            else {
                let ret = this.$injector().get(token, params && params.notFoundValue);
                if (params && params.autoDestroy)
                    this._$ijdestroys.push(ret);
                this._$ijs.push(ret);
                this._$ijTokens.push(token);
                return ret;
            }
        } else
            return this._$injector;
    }

    /**Lib提供常用方法 */
    public readonly Lib = Lib;

    /**$log，可用于模板 */
    public $log(...args: any[]) {
        console.log.apply(console, arguments);
    }

    /**SipConfig */
    @SipInject(SipAlainConfig) $config: SipAlainConfig;

    //#region Observable

    @SipInject(SipEventService)
    private _$eventSrv: SipEventService;

    /**
     * 订阅信息
     * @param event 事件名称
     */
    // public $subscribe(event: string): Observable<any>;
    /**
     * 订阅信息
     * @param event 事件名称
     * @param callback 成功内容
     * @param error 失败内容
     * @param complete 完成内容
     */
    // public $subscribe(event: string, callback: (value?: any) => void, error?: (error?: any) => void, complete?: () => void): Subscription;
    public $subscribe(event: string, callback?: (value?: any) => void, error?: (error?: any) => void, complete?: () => void): Subscription {
        // if (!Lib.isFunction(callback))
        //     return this._$eventSrv.subscribe(event, this);
        // else
        return this._$eventSrv.subscribe(event, callback, error, complete, this);
    }

    /**
     * 发布信息
     * @param event 事件名称
     * @param eventObject 发布内容
     * @param global 是否发布到全部，默认为否（只向本身发布）
     */
    public $publish(event: string, eventObject?: any, global?: boolean) {
        return this._$eventSrv.publish(event, eventObject, global === true ? null : this);
    }

    //#endregion Observable

    //#region Router

    /**Router */
    @SipInject(Router) $router: Router;

    /**
     * router 链接
     * @param url 
     * @param queryParams 参数
     * @example this.$navigate('/sip/test-create', {id:1});
     */
    public $navigate(url: string, queryParams?: object): SipUiLink {
        let params = queryParams ? Object.assign({}, queryParams) : {};
        let link = _createNavigateLink(this, params);
        if (this._$navigateChildren && this.$config.page.onceChild) {
            this._$navigateChildren.forEach(function (item) { item.close() });
        }
        let navChilds = this._$navigateChildren || (this._$navigateChildren = []);
        navChilds.push(link);
        this.$router.navigate([url, params]);
        return link;
    }

    private _$navigateChildren: SipUiLink[];
    public get $navigateChildren(): SipUiLink[] {
        return this._$navigateChildren;
    }

    //#endregion Router

    /**SipRestService */
    @SipInject(SipRestService) $httpSrv: SipRestService;

    private _$isDestroyed: boolean = false;
    public get $isDestroyed(): boolean {
        return this._$isDestroyed;
    }

    /**销毁 */
    $destroy() {
        if (this._$isDestroyed) return;
        this._$isDestroyed = true;
        if (this._$navigateChildren) {
            let page = this.$config.page
            if (page.autoCloseChild)
                this._$navigateChildren.forEach((p) => { p.isDestory || p.close(); });
            this._$navigateChildren = null;
        }
        this._$eventSrv.removeOwner(this);
        if (this._$ijdestroys.length)
            this._$ijdestroys.forEach((item) => { item.$destroy && item.$destroy(); });
        this._$ijs = this._$ijTokens = this._$injector = null;
    }

}

/**Sip UI 基础类 */
export class SipUiBase extends SipParent implements OnInit, OnDestroy, OnChanges, DoCheck, AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit {

    ngOnChanges() { }
    ngOnInit() { }
    ngDoCheck() { }
    ngAfterContentInit() { }
    ngAfterContentChecked() { }
    ngAfterViewInit() { }
    ngAfterViewChecked() { }
    ngOnDestroy() { }

    /**@SipWatch占用 */
    private _$sipWatch: any;

    constructor(public readonly $vcf: ViewContainerRef) {
        super($vcf.injector);
    }

    $showed = false;
    $loading = true;

    private _$showPreLoad: { list: Observable<any>[]; timeId: any; };
    private _$checkPreLoad(obs: Observable<any>) {
        if (this.$showed || this.$isDestroyed) return;

        setTimeout(() => {
            if (this.$showed || this.$isDestroyed) return;
            let list = this._$showPreLoad ? this._$showPreLoad.list : [];
            let index = obs ? list.indexOf(obs) : -1;
            if (index >= 0) {
                list.splice(index, 1);
            }
            if (list.length == 0) {
                this.$showed = true;
                this.$loading = false;
                this._$showPreLoad = null;
                this.$onShow.emit();
            }
        }, 1);
    }
    $showPreLoad(obs: Observable<any>) {
        if (this.$showed || this.$isDestroyed) return obs;
        if (!this._$showPreLoad) {
            this._$showPreLoad = {
                list: [],
                timeId: null
            };
        }
        this._$showPreLoad.list.push(obs);
        return obs.pipe(breakOff(() => {
            this._$checkPreLoad(obs);
            return false;
        }));
    }
    @SipNgInit()
    private _$sip_init() {
        this._$checkPreLoad(null);
    }

    private _$onShow: EventEmitter<any>;
    get $onShow(): EventEmitter<any> {
        return this._$onShow || (this._$onShow = new EventEmitter<any>());
    }

    @SipInject(FormBuilder) $formBuilder: FormBuilder;

    /**MenuService */
    @SipInject(MenuService) $menuSrv: MenuService;

    private _$menuItem: Menu;
    /**页面当前对象的Menu项 */
    public get $menuItem(): Menu {
        return this._$menuItem
            || (this._$menuItem = this.$getMenuByUrl(this.$url));
    }

    $getMenuByUrl(url: string): Menu {
        let menus = this.$menuSrv.getPathByUrl(url);
        let len = menus ? menus.length : 0;
        return len ? menus[len - 1] : null;
    }

    //#region Router

    /**ActivatedRoute */
    @SipInject(ActivatedRoute) $activatedRoute: ActivatedRoute;

    private _$routeParams: any;
    /**获取route 参数 */
    public get $routeParams(): any {
        let routeParams = this._$routeParams;
        if (routeParams) return routeParams;
        routeParams = this._$routeParams =
            Lib.extend({}, this.$activatedRoute.queryParams.toValue(),
                this.$activatedRoute.params.toValue());
        return routeParams;
    }

    private _$getTruthRoute(actRouteSN: ActivatedRouteSnapshot) {
        let next = actRouteSN;
        while (next.firstChild) next = next.firstChild;
        return next;
    }

    private _$getUrl(actRoute: ActivatedRoute): string {
        let next = this._$getTruthRoute(actRoute.snapshot);
        const segments = [];
        while (next) {
            segments.push(next.url.join('/'));
            next = next.parent;
        }
        const url = '/' + segments.filter(i => i).reverse().join('/');
        return url;
    }

    private _$url: string;
    /**当前页面的url */
    public get $url(): string {
        return this._$url
            || (this._$url = this._$getUrl(this.$activatedRoute));
    }

    //#endregion Router

    //#region modal

    /**
     * 动态添加模板
     * @param tmpl TemplateRef内容
     * @param context 传入模板的参数内容
     * @param isApp 是否添加到App, 默认为(false)添加到本组件
    */
    $appendTemplate(tmpl: TemplateRef<any>, context?: any, isApp?: boolean): ViewRef {
        if (isApp) {
            let appContainer: SipAppContainerService = this.$injector(SipAppContainerService);
            if (appContainer) return appContainer.appendTemplate(tmpl, context);
        } else {
            let view = this.$vcf.insert(tmpl.createEmbeddedView(context))
            return view;
        }
    }

    /**
     * 动态添加组件
     * @param type 组件类名
     * @param params 传入参数
     * @param isLayout 是否添加到layout, 默认添加到本组件
     */
    $appendComponent<T>(type: Type<T>, params?: Object, isLayout?: boolean): ComponentRef<T> {
        if (isLayout) {
            let appContainer: SipAppContainerService = this.$injector(SipAppContainerService);
            if (appContainer) return appContainer.appendComponent(type, params, this.$injector(ComponentFactoryResolver));
        } else {
            let cfr: ComponentFactoryResolver = this.$injector(ComponentFactoryResolver);
            let componentFactory = cfr.resolveComponentFactory(type);
            let compRef = this.$vcf.createComponent(componentFactory);

            if (params) {
                let instance: any = compRef.instance;
                Object.assign(instance, params);
            }

            return compRef;
        }
    }

    /**
     * 打开对话框
     * @param type 定义类
     * @param params 参数
     * @example this.$modal(TestModalComponent, {id:1}) 
     */
    public $modal(type: Type<SipModal>, params?: Object): SipUiLink {
        params = params ? Object.assign({}, params) : {};
        let link = _createNavigateLink(this, params);
        _$modalParams = params;
        let compRef = this.$appendComponent(type, params);
        let instance: SipModal = compRef.instance;
        instance.$publish('SipModal._$sipcompRef', compRef);
        return link;
    }

    //#endregion modal

    @SipNgDestroy()
    private _$ngDestroy() {
        this.$destroy();
        this._$onShow = this._$sipWatch = null;
    }

}

/**服务基础类 */
export class SipService extends SipParent {
    constructor(injector: Injector) {
        super(injector);
    }
}

/**指令基础类 */
export class SipDirective extends SipUiBase {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    /**所在业务组件，如：SipPage或SipModal */
    public get $business(): SipBusinessComponent {
        return this.$injector(SipBusinessComponent);
    }
}

/**组件基础类 */
export class SipComponent extends SipUiBase {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    /**所在业务组件，如：SipPage 或 SipModal */
    public get $business(): SipBusinessComponent {
        return this.$injector(SipBusinessComponent);
    }
}

/**具体业务的组件 */
export class SipBusinessComponent extends SipUiBase {
    constructor(vcf: ViewContainerRef) {
        super(vcf);
        let params = this.$params();
        let link = this._$uiLink = _getNavigateLink(params) || new SipUiLink(null);
        if (link) link.owner = this;

        this.$access || (this.$access = new SipAccessManager({ access: {} }));

    }

    /**出入口管理 */
    $access: SipAccessManager;

    public $close() { };

    /**
     * 获取参数
     * @param defaultValue 默认内容
     * @example this.params = this.$params({id:0});
     */
    public $params(defaultValue?: any): any {
        return {};
    }

    /**打开者 */
    public get $opener(): SipBusinessComponent {
        return this.$uiLink.opener;
    }

    private _$uiLink: SipUiLink;
    /**SipUiLink */
    public get $uiLink(): SipUiLink {
        return this._$uiLink;
    }

    @SipNgDestroy()
    private _$sipBusDestroy() {
        this.$uiLink.destory();

        this.$access = this._$uiLink = null;
    }
}

/**对话框基础类 */
export class SipModal extends SipBusinessComponent {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
        this._$params = _$modalParams;
        _$modalParams = null;
    }

    private _$sipcompRef: ComponentRef<any>;
    @SipSubscribe('SipModal._$sipcompRef')
    private _$setSipcompRef(p: any) {
        this._$sipcompRef = p;
    }

    private _$params: any;
    /**
     * 获取参数
     * @param defaultValue 默认内容
     * @example this.params = this.$params({id:0});
     */
    $params(defaultValue?: any): any {
        return defaultValue ? Lib.extend({}, defaultValue, this._$params)
            : this._$params;
    }

    private _$modal: any;
    @SipSubscribe('SipModal.Set')
    private _$sipModalSet(p: any) {
        this._$modal = p;
    }

    public get $showed(): boolean {
        return this._$modal && this._$modal.showed;
    }
    public set $showed(p: boolean) {
        this._$modal && (this._$modal.showed = p);
    }

    public get $loading(): boolean {
        return this._$modal && this._$modal.loading;
    }
    public set $loading(p: boolean) {
        this._$modal && (this._$modal.loading = p);
    }

    /**关闭对话框 */
    $close(p?: any) {
        if (arguments.length > 0)
            this.$uiLink.publish(p);
        this._$modal && this._$modal.$publish('SipModal.Close');
    }

    @SipSubscribe('ModalComponent.onDestroy')
    private _modalOnDestroy(p: any) {
        this._$sipcompRef && this._$sipcompRef.destroy();
        this._$sipcompRef = null;
    }

    @SipNgDestroy()
    private _$sipModelDestroy() {
        this._$modal = this._$params
            = this._$sipcompRef = null;
    }

}

/**页面基础类 */
export class SipPage extends SipBusinessComponent {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    private _$page: any;
    @SipSubscribe('SipPage.Set')
    private _$sipPageSet(p: any) {
        this._$page = p;
    }
    public get $showed(): boolean {
        return this._$page && this._$page.showed;
    }
    public set $showed(p: boolean) {
        this._$page && (this._$page.showed = p);
    }

    public get $loading(): boolean {
        return this._$page && this._$page.loading;
    }
    public set $loading(p: boolean) {
        this._$page && (this._$page.loading = p);
    }

    /**
     * 获取参数
     * @param defaultValue 默认内容
     * @example this.params = this.$params({id:0});
     */
    $params(defaultValue?: any): any {
        return defaultValue ? Lib.extend({}, defaultValue, this.$routeParams)
            : this.$routeParams;
    }

    /**关闭页面 */
    $close(p?: any) {
        if (arguments.length > 0)
            this.$uiLink.publish(p);
        let reuseTabSrv: ReuseTabService = this.$injector(ReuseTabService);
        let url = this.$url;
        reuseTabSrv.close(url);

    }

    $closeOther() {
        let reuseTabSrv: ReuseTabService = this.$injector(ReuseTabService);
        let url = this.$url;
        reuseTabSrv.move(url, 0);
        reuseTabSrv.closeRight(url, true);
    }

    public get $isChild(): boolean {
        return !!this.$uiLink.opener;
    }

}

