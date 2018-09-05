import { Injectable, Injector } from '@angular/core';
import { Lib } from 'sip-lib';
import { SipRestSqlRet, SipSqlParam } from '../../../../base/sip-rest-base';
import { SipRestService } from '../../../../services/sip-rest.service';
import { Filter, SortMeta } from '../../ng-data-table';
import { SipTableDataSource } from '../base/sip-table-data-source';
import { SipTableSettings } from '../base/sip-table-settings';

@Injectable()
export class SipTableServerSourceService extends SipTableDataSource {

  public url: string;
  public primaryKeys: any;

  public get searchparams(): object {
    return this.settings.searchparam;
  }

  public set searchparams(value: object) {
    this.settings.searchparam = value;
  }

  private http: SipRestService;
  private settings: SipTableSettings;
  private rs: SipRestSqlRet;
  private pageSize: number;

  constructor(private injector: Injector, settings: SipTableSettings) {
    super();
    this.http = this.injector.get(SipRestService);
    this.settings = new SipTableSettings(settings, injector);
    this.pageSize = this.settings.pageSize || 10;
  }

  private _oldfilterKeys: string[];
  private makeSqlParam(page: number, filters: Filter, sortMeta: SortMeta[]): SipSqlParam {
    let param: SipSqlParam = <SipSqlParam>this.settings;
    param.pageIndex = page;
    let searchparams = this.searchparams || {};
    param.searchparam = searchparams;
    let oldfilterKeys = this._oldfilterKeys;
    if (oldfilterKeys && oldfilterKeys.length > 0) {
      oldfilterKeys.forEach((key) => searchparams[key] = undefined);
    }
    this._oldfilterKeys = filters ? Object.keys(filters) : null;
    Lib.eachProp(filters, function (item, name) {
      searchparams[name] = Lib.isArray(item.value) ? item.value.join(',') : item.value;
    });
    let sortMetaLen = sortMeta.length;
    if (sortMeta && sortMetaLen > 0) {
      if (sortMetaLen > 1) {
        let sortnames = [];
        Lib.each(sortMeta, function (item: SortMeta) {
          sortnames.push([item.field, item.order < 0 ? 'desc' : 'asc'].join(' '));
        });
        param.sortName = sortnames.join(',');
        param.sortOrder = '';
      } else {
        param.sortName = sortMeta[0].field;
        param.sortOrder = sortMeta[0].order < 0 ? 'desc' : 'asc';
      }

    }
    // console.log('param', param, filters, sortMeta);
    return param;
  }

  getItems(page: number = 1, filters: Filter, sortMeta: SortMeta[], globalFilterValue?: string): Promise<any> {
    let param: SipSqlParam = this.makeSqlParam(page, filters, sortMeta);
    let restSrv = this.settings.restSrv;
    return (restSrv ? restSrv(param) : this.http.sql(param))
      .toPromise()
      .then((rs: SipRestSqlRet) => {
        this.rs = rs;
        const rows: any[] = rs.datas || [];

        const result = {
          'items': rows,
          '_meta': {
            'totalCount': rs.total,
            'pageCount': rs.totalPages,
            'currentPage': rs.pageIndex,
            'perPage': this.pageSize
          }
        };
        return result;
      });
  }

  getItem(id: number): Promise<any> {
    return new Promise((resolve) => {
      let item: any, prikey: string = this.primaryKeys ? this.primaryKeys[0] : '';
      if (prikey) {
        let rows = this.rs.datas || [];
        Lib.each(rows, function (it) {
        });
      }
      return item;
    });
  }

  post(item: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 100);
    });
  }

  put(item: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 100);
    });
  }

  delete(item: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 250);
    });
  }

  getOptions(url: string, parentId: any): Promise<any> {
    return this.http.get(url)
      .toPromise()
      .then((response: any) => {
        const result = response.datas.filter((value: any) => {
          return value['parentId'] === parentId;
        });
        return new Promise((resolve) => {
          setTimeout(() => resolve(result), 1000);
        });
      })
      .catch(this.handleError);
  }

  private handleError(error: any) {
    const errMsg = error.message ? error.message : error.toString();
    return Promise.reject(errMsg);
  }
}
