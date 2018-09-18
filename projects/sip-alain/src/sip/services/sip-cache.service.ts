import { Injectable } from '@angular/core';
import { Lib } from 'sip-lib';

let undef;

interface CacheItem {
  key: string;
  value: any;
}

@Injectable()
export class SipCacheService {

  constructor() { }

  private makeKey(key: string | object): string {
    return Lib.isObject(key) ? JSON.stringify(key) : key as string;
  }

  //#region objectCaches

  private objectCaches(obj: any): CacheItem[] {
    let name = '__objectcache__';
    return obj[name] || (obj[name] = []);
  }

  private objectCacheIndex(objcache: CacheItem[], key: string): number {
    let caches = objcache;
    return caches.findIndex(item => item.key == key);
  }

  public getObjectCache(obj: any, key: string | object): any {
    let objectCaches = this.objectCaches(obj);
    key = this.makeKey(key);
    let index = this.objectCacheIndex(objectCaches, key);
    let cacheItem = index >= 0 ? objectCaches[index] : undef;
    return cacheItem && cacheItem.value;
  }

  public setObjectCache(obj: any, key: string | object, value: any): any {
    let objectCaches = this.objectCaches(obj);
    key = this.makeKey(key);
    let cacheItem = {
      key: key,
      value: value
    }
    let index = this.objectCacheIndex(objectCaches, key);
    if (index >= 0)
      objectCaches[index] = cacheItem;
    else
      objectCaches.push(cacheItem);
    return cacheItem;
  }

  private _content = {};

  /**
   * 获取内容
   * @param key 
   */
  public content(key: string): any;
  /**
   * 设置内容
   * @param key 
   * @param value 值，可选，如果没此参数为获取内容
   */
  public content(key: string, value: any): any;
  public content(key: any, value?: any): any {
    if (arguments.length == 1)
      return this._content[key];
    else
      return this._content[key] = value;
  }

  /**删除一个项 */
  public remove(key: string) {
    if (key in this._content)
      delete this._content[key];
  }

  /**是否存在 */
  public exists(key: string) {
    return (key in this._content);
  }

  /**删除所有 */
  public removeAll() {
    this._content = {};
  }

  //#endregion objectCaches

}
