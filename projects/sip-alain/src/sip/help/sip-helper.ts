import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, DoCheck, EventEmitter, forwardRef, Injector, OnChanges, OnDestroy, OnInit, QueryList, ReflectiveInjector, TemplateRef, Type, ViewContainerRef, ViewRef } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
import { ReuseTabService } from "@delon/abc";
import { Menu, MenuService } from "@delon/theme";
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { Observable, of, Subject, Subscription, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lib } from 'sip-lib';
import { SipAlainConfig } from '../base/sip-alain-config';
import { ISipRestDict, SipRestParam, SipRestRet, SipRestSqlRet, SipSqlParam } from '../base/sip-rest-base';
import { SipAppContainerService } from '../services/sip-app-container.service';
import { SipEventService } from '../services/sip-event.service';
import { SipLoggerService } from '../services/sip-logger.service';
import { SipNoticeService } from '../services/sip-notice.service';
import { SipRestService } from '../services/sip-rest.service';

//#region equals

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

//#endregion equals

//#region watch

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
    _pushNgEvent(target, 'ngDoCheck', function () {
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
                        newVal = item.call(this, this);
                        isCLi && (isCLi = !_equals(val[idx], newVal));
                        newValList.push(newVal);
                    }, this);
                    isC || (isC = isCLi);
                    res.push(newValList);
                }
            } else {
                newVal = item.call(this, this);
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
 * @param args 观察对象，可以字串、数组和方法:(target) => any，要先定义属性（报错）
 * @example SipWatch('this.title', ['this.title1', 'this.title2'])
 */
export function SipWatch(...args: any[]) {
    return function (target: any, propKey: string) {
        _pushWatch(target, args, target[propKey]);
    };
}

//#endregion watch

//#region component events

let _injectNgEvent = function (target: any, eventName: string) {

    let oldFn = target[eventName];
    if (!oldFn) {
        target[eventName] = function () {
            if (this.$isDestroyed) return;
            _doNgEventItem(this, eventName);
        };
        target[eventName].sipInject = true;
    } else if (!oldFn.sipInject) {
        target[eventName] = function () {
            if (this.$isDestroyed) return;
            oldFn.apply(this, arguments);
            _doNgEventItem(this, eventName);
        };
        target[eventName].sipInject = true;
    }

};

let _getNgEventName = function (eventName: string) {
    return ['_$sip_ng', eventName].join('_')
};

/**_pushNgEvent(target, 'ngOnInit', target[propKey]) */
let _pushNgEvent = function (target: any, eventName: string, newFn: Function): any[] {

    _injectNgEvent(target, eventName);

    let ngEventName = _getNgEventName(eventName);
    return _pushStaticList(target, ngEventName, newFn);

};

let _getNgEvents = function (target: any, eventName: string): any[] {
    eventName = _getNgEventName(eventName);
    return _getStaticList(target, eventName);
};

let _getNgEventAfterName = function (eventName: string) {
    return [_getNgEventName(eventName), 'after'].join('_');
};

let _pushNgEventAfter = function (target: any, eventName: string, newFn: Function): any[] {
    eventName = _getNgEventAfterName(eventName);
    return _pushStaticList(target, eventName, newFn);

};

let _getNgEventAfters = function (target: any, eventName: string): any[] {
    _injectNgEvent(target, eventName);

    eventName = _getNgEventAfterName(eventName);
    return _getStaticList(target, eventName);
};

let _doNgEventItem = function (owner: any, eventName: string) {
    let key = ['_$sip_ng_done_event', eventName].join('_')
    if (owner[key]) return;
    owner[key] = true;
    let evFns = _getNgEvents(owner, eventName);
    let evAfterFns = _getNgEventAfters(owner, eventName);
    evFns && evFns.forEach((fn) => fn && fn.call(owner))
    evAfterFns && evAfterFns.forEach((fn) => fn && fn.call(owner))
}

/**
 * 在Angular第一次显示数据绑定和设置指令/组件的输入属性之后，初始化指令/组件。在第一轮EventChange()完成之后调用，只调用一次。
 */
export function SipNgInit() {
    return function (target: any, propKey: string) {
        _pushNgEvent(target, 'ngOnInit', target[propKey]);
    };
}

/**
 * 检测，并在发生Angular无法或不愿意自己检测的变化时作出反应。在每个Angular变更检测周期中调用，EventChange()和EventInit()之后。
 */
export function SipNgCheck() {
    let a;
    return function (target: any, propKey: string) {
        _pushNgEvent(target, 'ngDoCheck', target[propKey]);
    };
}

/**
 * 当Angular（重新）设置数据绑定输入属性时响应。 该方法接受当前和上一属性值的SimpleChanges对，当被绑定的输入属性的值发生变化时调用，首次调用一定会发生在EventInit()之前。
 */
export function SipNgChange() {
    let a;
    return function (target: any, propKey: string) {
        _pushNgEvent(target, 'ngOnChanges', target[propKey]);
    };
}

/**
 * 当把内容投影进组件之后调用。第一次EventCheck()之后调用，只调用一次。只适用于组件。
 */
export function SipNgAfterContentInit() {
    let a;
    return function (target: any, propKey: string) {
        _pushNgEvent(target, 'ngAfterContentInit', target[propKey]);
    };
}

/**
 * 每次完成被投影组件内容的变更检测之后调用。EventAfterContentInit()和每次EventCheck()之后调用，只适合组件。
 */
export function SipNgAfterContentChecked() {
    let a;
    return function (target: any, propKey: string) {
        _pushNgEvent(target, 'ngAfterContentChecked', target[propKey]);
    };
}

/**
 * 初始化完组件视图及其子视图之后调用。第一次EventAfterContentChecked()之后调用，只调用一次。只适合组件。
 */
export function SipNgAfterViewInit() {
    let a;
    return function (target: any, propKey: string) {
        _pushNgEvent(target, 'ngAfterViewInit', target[propKey]);
    };
}

/**
 * 每次做完组件视图和子视图的变更检测之后调用。EventAfterViewInit()和每次EventAfterContentChecked()之后调用。只适合组件。
 */
export function SipNgAfterViewChecked() {
    let a;
    return function (target: any, propKey: string) {
        _pushNgEvent(target, 'ngAfterViewChecked', target[propKey]);
    };
}

/**
 * 当Angular每次销毁指令/组件之前调用并清扫。 在这儿反订阅可观察对象和分离事件处理器，以防内存泄漏。在Angular销毁指令/组件之前调用。
 */
export function SipNgDestroy() {
    let a;
    return function (target: any, propKey: string) {
        _pushNgEvent(target, 'ngOnDestroy', target[propKey]);
    };
}

//#endregion component events

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
    _pushNgEvent(target, 'sipOnConstructor', function () {
        if (!this.$subscribe) return;
        let tFn = function () {
            fn.apply(this, arguments);
        }.bind(this);
        this.$subscribe(event, params.success ? tFn : null, params.error ? tFn : null, params.complete ? tFn : null);
    });
};

/**
 * 订阅，（注意：在服务[service]里只会订阅全局，要手动使用$unSubscribe解除订阅）
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
    /**单独，每次创建新的服务 */
    singleton?: boolean;
}

/**
 * 定义一个注入服务, 可以用于service
 * @param token 注入tokey
 * @param params 参数
 * @example SipInject(TestServcie, { autoDestroy: true })
 */
export function SipInject(token: any, params?: ISipInjectParams) {
    if (params && params.singleton)
        params.autoDestroy = true;
    return function (target: any, propKey: string) {
        if (token._$sipPreDatas) {
            let obs;
            _pushPrepareFn(target, function (owner: any) {
                if (obs) return obs;
                obs = this[propKey].$loadPreDatas(owner).pipe(map(function (p) {
                    obs = null;
                    return p;
                }));
                return obs
            });
        }
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

/**
 * QueryList变为普通Array
 * @param prop
 * @param map
 * @example SipQueryList('this.queryList', function(queryList){ return queryList.map(function(item){return item.aaa})})
 */
export function SipQueryList(prop: string, map?: (queryList: QueryList<any>) => any[]) {
    let fn: any = new Function('return ' + prop);
    return function (target: any, propKey: string) {
        Object.defineProperty(target, propKey, {
            configurable: false,
            enumerable: true,
            get: function () {
                let sipQueryList = this.__SipQueryList$ || (this.__SipQueryList$ = {});
                let list = sipQueryList[propKey];
                if (!list) {
                    let qList = fn.call(this);
                    qList.changes.subscribe((p) => {
                        sipQueryList[propKey] = map ? map.call(this, qList) : qList.toArray();
                    });
                    list = sipQueryList[propKey] = map ? map.call(this, qList) : qList.toArray();
                }
                return list;
            }
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
    check?: (this: T, datas: any[], target: T) => boolean;
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
        _pushNgEvent(target, 'sipOnConstructor', function () {
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
        _pushNgEvent(target, 'ngOnInit', function () {
            let access: SipAccessManager = this.$access;
            if (access && params) {
                _has = true;
                let pp: any = Lib.extend({}, params);
                pp.check = function (datas: any[]) {
                    return _checkFn && _checkFn.call(this, datas, this);
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
        if (checkOk && acItem.check) checkOk = acItem.check(datas, this);
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

export interface ISipRestDefParamsBase<T=any> extends SipRestParam {
    //改造数据
    map?: (rs: SipRestRet<T>, target?: any) => any;
    //数据模型
    model?: Type<any>;
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
                    let model = tempParams.model;
                    let mapFn = tempParams.map;
                    if (mapFn || model) {
                        obs = obs.pipe(map((rs) => {
                            let datas = rs.datas;
                            if (model && datas) {
                                if (Lib.isArray(datas))
                                    datas = datas.map(function (item) { return new model(item); });
                                else
                                    datas = new model(datas);
                                rs.datas = datas;
                            }
                            mapFn && (rs.datas = mapFn(rs, this));
                            return rs;
                        }));
                    }
                    return obs;
                }.bind(this);
            }
        });
    };
}

export interface ISipRestSqlDefParams<T=any> extends SipSqlParam, ISipRestDefParamsBase<T> {
    sqlType?: SipRestSqlType;
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
                    // let url = tempParams.url;
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
                    let model = tempParams.model;
                    let mapFn = tempParams.map;
                    if (mapFn || model) {
                        obs = obs.pipe(map((rs) => {
                            let datas = rs.datas;
                            if (model && datas) {
                                if (Lib.isArray(datas))
                                    datas = datas.map(function (item) { return new model(item); });
                                else
                                    datas = new model(datas);
                                rs.datas = datas;
                            }
                            mapFn && (rs.datas = mapFn(rs, this));
                            return rs;
                        }));
                    }
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

//#region SipFormGroup

export interface ISipFormSubmitOption {
    form: string;
    message?: string | boolean;
}

/**
 * 提交方法
 * @param form form
 * @example @SipSubmitForm('this.form', 'this.form1')
 */
export function SipFormSubmit(...forms: (string | ISipFormSubmitOption)[]) {
    let formFnList = forms.map(function (form: any) { return new Function('return ' + (Lib.isString(form) ? form : form.form)); });
    return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
        let oldFn = target[propKey];
        descriptor.value = function () {
            let formList = formFnList.map((formFn) => {
                return formFn.call(this);
            });
            let valid = true;
            Lib.each(formList, function (form, idx) {
                for (const i in form.controls) {
                    form.controls[i].markAsDirty();
                    form.controls[i].updateValueAndValidity();
                }
                if (!form.valid) {
                    let fParam: any = forms[idx];
                    let msg = Lib.isString(fParam) ? false : fParam.message;
                    if (msg) this.$message.warning(msg === true ? '数据验证不通过!' : msg);
                    valid = false;
                    return false;
                }
            }, this);
            if (!valid) return;
            return oldFn.apply(this, arguments);
        };

    };
}

export interface ISipFormGroupWatchValue {
    value: any; oldValue: any;
}

export interface ISipFormGroup<T=any> extends FormGroup {
    $model: T;
    /**
     * 观察
     * @param propKey 属性名称，propKey为空表示任何属性变动都发布（订阅所有属性）
     * @example $watch('id', 'name', ...)
     */
    $watch: (...propKeys: string[]) => Observable<ISipFormGroupWatchValue[]>;
    $toJSONObject: () => T
    [key: string]: any;
}

export interface ISipFormGroupParams<T> {
    model: T;
    validators?: { [key: string]: any };
    extra?: { [key: string]: any };
}

function _createSipFormGropup<T=any>(params: ISipFormGroupParams<T>): ISipFormGroup<T> {
    let valids = {};
    let modelObj = {};
    let watchObj = {};
    let modelThis = params.model;
    let validatorsTemp = params.validators;
    Lib.eachProp(modelThis, function (item, name) {
        if (validatorsTemp[name])
            valids[name] = [item, validatorsTemp[name]];
        else
            valids[name] = [item];
        Object.defineProperty(modelObj, name, {
            enumerable: true, configurable: false,
            get: function () {
                let ctrl = formGroup.get(name);
                return ctrl ? ctrl.value : modelThis[name];
            },
            set: function (value) {
                let obj = {};
                obj[name] = value;
                formGroup.patchValue(obj, { onlySelf: true, emitEvent: hasWatch && !_equals(oldValueObj[name], value) });
            }
        });
    }, this);
    let extraTemp = params.extra;
    let formGroup: ISipFormGroup = this.$formBuilder.group(valids, extraTemp);
    Object.defineProperty(formGroup, '$model', {
        enumerable: true, configurable: false,
        get: function () {
            return modelObj;
        },
        set: function (value) {
            Object.assign(modelObj, value || {});
        }
    });
    let oldValueObj = {};
    let hasWatch = false;
    let initValueChanges = function () {
        if (hasWatch) return;
        formGroup.valueChanges.subscribe((p) => {
            Lib.eachProp(watchObj, function (item, name) {
                let value = p[name];
                let oldValue = oldValueObj[name];
                //name为空表示任何属性变动都发布（订阅所有属性）
                if (!_equals(oldValue, value)) {
                    oldValueObj[name] = value;
                    item.next([{ value: value, oldValue: oldValue }]);
                }
            });
        });
    };
    let watchProp = function (name?: string) {
        initValueChanges();
        hasWatch = true;
        let subject: Subject<any> = watchObj[name] || (watchObj[name] = new Subject());
        oldValueObj[name] = modelObj[name];

        return subject.asObservable();
    };
    let watchMerge = function (names: string[]) {
        let subject = new Subject();
        let values = [];
        names.forEach((name: string, idx) => {
            let defVal = modelObj[name];
            values[idx] = { oldValue: defVal, value: defVal };
            watchProp(name).subscribe(function (vals) {
                values[idx] = vals[0];
                subject.next(values);
            });
        });
        return subject.asObservable();
    };
    Object.defineProperty(formGroup, '$watch', {
        enumerable: true, configurable: false,
        writable: false,
        value: function (...names: string[]) {
            if (names.length <= 1)
                return watchProp(names[0]);
            else
                return watchMerge(names);
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
    return formGroup;
}

export function SipFormGroup<T=object>(factory: (target: any) => ISipFormGroupParams<T>) {
    return function (target: any, propKey: string) {
        let key = '_$sip_formgroup_' + propKey + '$_';

        Object.defineProperty(target, propKey, {
            configurable: false,
            get: function () {
                if (key in this) return this[key];
                this[key] = null;
                let params = factory(this);
                return this[key] = _createSipFormGropup.call(this, params);
            }
        });

        _pushNgEvent(target, 'ngOnDestroy', function () {
            this[key] = null;
        });
    };
}

//#endregion SipFormGroup

/**静态属性数组添加内容 */
function _pushStaticList(target: any, propKey: string, item: any): any[] {
    let classFn = target.constructor;
    return classFn[propKey] = (classFn[propKey] || []).concat(item);
}

function _getStaticList(target: any, propKey: string): any[] {
    let classFn = target.constructor;
    return classFn[propKey];
}

/**添加准备数据方法 */
function _pushPrepareFn(target: any, fn: any): any[] {
    return _pushStaticList(target, '_$sipPreDatas', fn);
}

/**准备数据， 服务或UI组件都可用 */
export function SipPrepareData() {
    return function (target: any, propKey: string) {
        let obs: Observable<any>;
        _pushPrepareFn(target, function () {
            if (obs) return obs;
            obs = target[propKey].apply(this, arguments);

            obs = obs.pipe(map((r) => { obs = null; return r }));
            return obs;
        });
    }
}

/**Sip初始化, 只能在UI组件使用, 自动准备数据(SipPrepareData) */
export function SipInit() {
    return function (target: any, propKey: string) {
        let initFn = target[propKey];
        if (initFn) {
            if (_pushStaticList(target, '_$sipInits', initFn).length == 1) {
                /**如果第一个，在ngOnInit之后执行 */
                _pushNgEventAfter(target, 'ngOnInit', function () {
                    let initFns = _getStaticList(target, '_$sipInits');
                    let doFns = () => {
                        if (!this.$isDestroyed) {
                            Lib.each(initFns, function (fn) {
                                fn.call(this);
                            }, this);
                        }
                        subs && subs.unsubscribe();
                    };
                    let subs: Subscription = this.$loadPreDatas(this).subscribe(doFns, doFns);
                });
            }
        }
    }
}

/**modal传参数时用 */
let _$modalParams: any;

let _preLoadKey = '$loadPreDatas__180918';
/** Sip Parent 类 */
export class SipParent {
    // static _$sipPreDatas: any[];
    // static _$sipInits: any[];
    $loadPreDatas(owner: any): Observable<any> {
        if (this[_preLoadKey]) return this[_preLoadKey];
        let thisClass: any = this.constructor;
        let dataFns: any[] = thisClass._$sipPreDatas;
        if (dataFns && dataFns.length > 0) {
            let obs = [];
            Lib.each(dataFns, function (fn) {
                obs.push(fn.call(this, owner));
            }, this);
            let oz = this[_preLoadKey] = zip(...obs).pipe(map((r) => {
                this[_preLoadKey] = null;
                return r;
            }));
            return oz;
        }
        return of(null);
    }

    /**SipNgEvent占用 */
    private _$sipEvents: any;

    constructor(private _$injector: Injector, public readonly $vcf: ViewContainerRef) {
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
                let ret, injectorTemp = this.$injector();
                if (params && params.singleton) {
                    const refJector = ReflectiveInjector.resolveAndCreate([token], injectorTemp);
                    ret = refJector.resolveAndInstantiate(token);
                } else
                    ret = injectorTemp.get(token, params && params.notFoundValue);
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

    /**SipConfig */
    @SipInject(SipAlainConfig) $config: SipAlainConfig;
    /**日志服务 */
    @SipInject(SipLoggerService) $logger: SipLoggerService;

    @SipInject(SipNoticeService)
    private _$notice: SipNoticeService;
    /**通知 */
    get $notifies(): NzNotificationService {
        return this._$notice.notifies;
    }
    /**消息 */
    get $message(): NzMessageService {
        return this._$notice.message;
    }

    /**SipRestService */
    @SipInject(SipRestService) $httpSrv: SipRestService;

    /**NG 变化检测器 */
    @SipInject(ChangeDetectorRef) $cdRef: ChangeDetectorRef;

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
        let params = Object.assign({}, queryParams);
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

    //#region Observable

    @SipInject(SipEventService)
    private _$eventSrv: SipEventService;

    /**
     * 订阅信息, （注意：在服务[service]里只会订阅全局，要手动使用$unSubscribe解除订阅）
     * @param event 事件名称
     * @param callback 成功内容
     * @param error 失败内容
     * @param complete 完成内容
     */
    public $subscribe(event: string, callback?: (value?: any) => void, error?: (error?: any) => void, complete?: () => void): Subscription {
        return this._$eventSrv.subscribe(event, callback, error, complete, this.$vcf ? this : null);
    }

    /**
     * 取消订阅信息
     * @param event 事件名称
     */
    $unSubscribe(event?: string) {
        if (event)
            this._$eventSrv.unSubscribe(event, this);
        else
            this._$eventSrv.removeOwner(this);
    }

    /**
     * 发布信息，（注意：在服务[service]里只会发布全局信息）
     * @param event 事件名称
     * @param eventObject 发布内容
     * @param global 是否发布到全部，默认为否（只向本身发布）, （注意：在服务[service]里只会发布全局信息）
     */
    public $publish(event: string, eventObject?: any, global?: boolean) {
        return this._$eventSrv.publish(event, eventObject, (!this.$vcf || global === true) ? null : this);
    }

    //#endregion Observable


    //#region modal

    /**
     * 动态添加模板
     * @param tmpl TemplateRef内容
     * @param context 传入模板的参数内容
     * @param isApp 是否添加到App, 默认为(false)添加到本组件
    */
    $appendTemplate(tmpl: TemplateRef<any>, context?: any, isApp?: boolean): ViewRef {
        let vcf = this.$vcf;
        if (isApp || !vcf) {
            let appContainer: SipAppContainerService = this.$injector(SipAppContainerService);
            if (appContainer) return appContainer.appendTemplate(tmpl, context);
        } else {
            let view = vcf.insert(tmpl.createEmbeddedView(context))
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
        let vcf = this.$vcf;
        if (isLayout || !vcf) {
            let appContainer: SipAppContainerService = this.$injector(SipAppContainerService);
            if (appContainer) return appContainer.appendComponent(type, params, this.$injector(ComponentFactoryResolver));
        } else {
            let cfr: ComponentFactoryResolver = this.$injector(ComponentFactoryResolver);
            let componentFactory = cfr.resolveComponentFactory(type);
            let compRef = vcf.createComponent(componentFactory);

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
        let compRef = this.$appendComponent(type);
        let instance: SipModal = compRef.instance;
        instance.$publish('SipModal._$sipcompRef', compRef);
        return link;
    }

    //#endregion modal

    $alert(content: string | TemplateRef<any>, title?: string | TemplateRef<any>): SipUiLink {
        let cp = this.$config.ui.alert;
        return this.$modal(cp, { content: content, title: title });
    }

    $confirm(content: string | TemplateRef<any>, title?: string | TemplateRef<any>): SipUiLink {
        let cp = this.$config.ui.confirm;
        return this.$modal(cp, { content: content, title: title });
    }

    $prompt(content: string | TemplateRef<any>, p?: { value?: any; textarea?: boolean }, title?: string | TemplateRef<any>): SipUiLink {
        let cp = this.$config.ui.prompt;
        return this.$modal(cp, { content: content, title: title, p: p });
    }

    /**MenuService */
    @SipInject(MenuService) $menuSrv: MenuService;

    $getMenuByUrl(url: string): Menu {
        let menus = this.$menuSrv.getPathByUrl(url);
        let len = menus ? menus.length : 0;
        return len ? menus[len - 1] : null;
    }

    private _$isDestroyed: boolean = false;
    public get $isDestroyed(): boolean {
        return this._$isDestroyed;
    }

    private _$onDestroy: EventEmitter<any>;
    /**销毁事件 */
    public get $onDestroy(): EventEmitter<any> {
        return this._$onDestroy || (this._$onDestroy = new EventEmitter());
    }

    /**销毁 */
    $destroy() {
        if (this._$isDestroyed) return;
        this._$isDestroyed = true;
        if (this._$onDestroy) this._$onDestroy.emit();
        if (this._$navigateChildren) {
            let page = this.$config.page
            this._$navigateChildren.forEach((p) => {
                if (p.isDestory) return;
                p.opener = null;
                page.autoCloseChild && p.close();
            });
            this._$navigateChildren = null;
        }
        this.$unSubscribe();
        if (this._$ijdestroys.length)
            this._$ijdestroys.forEach((item) => { item.$destroy && item.$destroy(); });
        setTimeout(() => {
            this._$ijs = this._$ijTokens = this._$injector = null;
        }, 1);
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

    constructor(vcf: ViewContainerRef) {
        super(vcf.injector, vcf);
        // _initNgEvent(this);
    }

    $showed = true;
    $loading = false;

    @SipInject(FormBuilder) $formBuilder: FormBuilder;

    /**
     * 创建一个新的FormGroup
     * @param params 
     */
    $formGroup<T=any>(params: ISipFormGroupParams<T>): ISipFormGroup<T> {
        return _createSipFormGropup.call(this, params);
    }


    private _$menuItem: Menu;
    /**页面当前对象的Menu项 */
    public get $menuItem(): Menu {
        return this._$menuItem
            || (this._$menuItem = this.$getMenuByUrl(this.$url));
    }


    /**ActivatedRoute */
    @SipInject(ActivatedRoute) $activatedRoute: ActivatedRoute;

    private _$routeParams: any;
    /**获取route 参数 */
    public get $routeParams(): any {
        let routeParams = this._$routeParams;
        if (routeParams) return routeParams;
        this.$activatedRoute.queryParams.subscribe((p) => {
            routeParams = p;
        })
        let params;
        this.$activatedRoute.params.subscribe((p) => {
            params = p;
        })
        routeParams = this._$routeParams =
            Lib.extend({}, routeParams, params);
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

    @SipNgDestroy()
    private _$ngDestroy() {
        this.$destroy();
    }

}

/**服务基础类 */
export class SipService extends SipParent {
    constructor(injector: Injector) {
        super(injector, null);
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
    constructor(vcf: ViewContainerRef, private _$params?: any) {
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
        return defaultValue ? Lib.extend({}, defaultValue, this._$params)
            : this._$params;
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

    $destroy() {
        if (this.$isDestroyed) return;
        this.$uiLink.destory();

        this.$access = this._$params = this._$uiLink = null;
        super.$destroy();
    }
}

/**对话框基础类 */
export class SipModal extends SipBusinessComponent {

    constructor(vcf: ViewContainerRef) {
        super(vcf, _$modalParams);
        _$modalParams = null;
    }

    private _$sipcompRef: ComponentRef<any>;
    @SipSubscribe('SipModal._$sipcompRef')
    private _$setSipcompRef(p: any) {
        this._$sipcompRef = p;
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

    $destroy() {
        if (!this.$isDestroyed) {
            this._$modal = this._$sipcompRef = null;
            super.$destroy();
        }
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
        let rTab = reuseTabSrv.get(url);
        if ((!rTab && this.$isChild) || (rTab && rTab.closable))
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

/** 注入父类, SipBusinessComponent | SIpPage */
export function SipProvidePages(page: Type<SipPage>) {
    return [{ provide: SipBusinessComponent, useExisting: forwardRef(() => page) },
    { provide: SipPage, useExisting: forwardRef(() => page) }]
}

/** 注入父类, SipBusinessComponent | SipModal */
export function SipProvideModals(modal: Type<SipModal>) {
    return [{ provide: SipBusinessComponent, useExisting: forwardRef(() => modal) },
    { provide: SipModal, useExisting: forwardRef(() => modal) }]
}