import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Lib } from 'sip-lib';

let _notEvent = '[SipEventService] => Subscription method must get event name.';
let _ownerEventKey = '_$sipEvents';

@Injectable()
export class SipEventService {

    constructor() { }

    private _events: { [key: string]: Subject<any> } = {};
    private _setEvent(event: string, owner?: any): Subject<any> {
        if (owner) return this._setOwnerEvent(event, owner);

        let ev = this._events[event];
        if (!ev) ev = this._events[event] = new Subject<any>();
        return ev;
    }
    private _getEvents(event: string): Subject<any>[] {
        let list = this._getOwnerEvents(event);
        let ev = this._events[event];
        if (ev) list.unshift(ev);
        return list;
    }
    private _owners = [];
    private _indexOwner(owner: any) {
        return this._owners.findIndex(function (item) { return item == owner; });
    }
    removeOwner(owner: any) {
        let index = this._indexOwner(owner);
        if (index >= 0) {
            this._owners.splice(index, 1);
            this._owners.length || (this._owners = []);
            let events = this._ownerEvents(owner, true);
            if (events) {
                Lib.eachProp(events, function (item: Subject<any>) {
                    item && item.unsubscribe && item.unsubscribe();
                });
            }
        }
        return owner;
    }
    private _setOwner(owner: any) {
        let index = this._indexOwner(owner);
        if (index < 0) this._owners.push(owner);
        return owner;
    }
    private _ownerEvents(owner: any, isGet?: boolean): { [key: string]: Subject<any> } {
        let events = owner[_ownerEventKey];
        if (!events && isGet !== true)
            events = owner[_ownerEventKey] = {};
        return events;
    }
    private _setOwnerEvent(event: string, owner: any): Subject<any> {
        owner = this._setOwner(owner);
        let events = this._ownerEvents(owner);
        let ev = events[event];
        if (!ev) ev = events[event] = new Subject<any>();
        return ev;
    }
    private _getOwnerEvents(event: string): Subject<any>[] {
        let list = [];
        this._owners.forEach(function (owner) {
            let events = owner[_ownerEventKey];
            let ev = events[event];
            if (ev) list.push(ev);
        });
        return list;
    }

    /**
     * 订阅信息
     * @param event 事件名称
     * @param callback 成功内容
     * @param error 失败内容
     * @param complete 完成内容
     * @param owner 订阅者
     */
    public subscribe(event: string, callback?: (value: any) => void, error?: (error: any) => void, complete?: () => void, owner?: any): any {
        return this._setEvent(event, owner).subscribe(callback, error, complete);
    }

    /**
     * 取消订阅信息
     * @param event 事件名称
     * @param owner 订阅者
     */
    public unSubscribe(event: string, owner?: any) {
        let ev = this._events[event];
        if (ev) {
            ev.unsubscribe();
            this._events[event] = undefined;
        }
        this._owners.forEach(function (ownerItem) {
            if (owner && owner != ownerItem) return;
            let events = ownerItem[_ownerEventKey];
            let ev = events[event];
            if (ev) {
                ev.unsubscribe();
                events[event] = undefined;
            }
        });
    }

    /**
     * 发布信息
     * @param event 事件名称
     * @param eventObject 发布内容
     * @param owner 只发布到owner，如果为空发布到所有
     */
    public publish(event: string, eventObject?: any, owner?: any) {
        if (!event) {
            throw new Error(_notEvent);
        } else {
            if (owner) {
                let ev = owner[_ownerEventKey];
                ev && ev[event] && ev[event].next(eventObject);
            } else {
                var evs = this._getEvents(event);
                if (!evs || evs.length == 0) return;
                evs.forEach(function (ev) { ev.next(eventObject); });
            }
        }
    }
}
