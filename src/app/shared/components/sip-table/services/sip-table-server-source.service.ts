import { Injectable, Injector } from '@angular/core';
import { SipRestService, SipRestSqlRet } from 'sip-alain';
import { Lib } from 'sip-lib';
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
  private pageSize:number;

  constructor(private injector: Injector, settings: SipTableSettings) {
    super();
    this.http = this.injector.get(SipRestService);
    this.settings = Object.assign(settings);
    this.pageSize = settings.pageSize || 10;
  }

  getItems(page: number = 1, filters: Filter, sortMeta: SortMeta[], globalFilterValue?: string): Promise<any> {
    return this.http.sql(this.settings)
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
