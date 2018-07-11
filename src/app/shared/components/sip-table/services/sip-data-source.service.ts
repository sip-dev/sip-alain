import { Injectable, Injector } from '@angular/core';
import { SipRestService } from 'sip-alain';
import { Filter, SortMeta } from '../../ng-data-table';
import { DataFilter, DataSort } from '../../ng-data-table/base';
import { SipTableDataSource, SipTableSettings } from '../base';

@Injectable()
export class SipDataSourceService extends SipTableDataSource {

  public url: string;
  public primaryKeys: any;

  private pageSize: number = 10;
  private dataFilter: DataFilter;
  private dataSort: DataSort;
  private http: SipRestService;

  constructor(private injector: Injector, private settings:SipTableSettings ) {
    super();
    this.http = this.injector.get(SipRestService);
    this.dataFilter = new DataFilter();
    this.dataSort = new DataSort(settings);
    this.pageSize =  settings.pageSize || this.pageSize;
  }

  getItems(page: number = 1, filters: Filter, sortMeta: SortMeta[], globalFilterValue?: string): Promise<any> {
    return this.http.sql(this.settings)
      .toPromise()
      .then(function (res) {
        const rows: any[] = res.datas || [];
        this.dataFilter.filters = filters;
        if (Object.keys(filters).length === 0 && globalFilterValue) {
          this.dataFilter.isGlobal = true;
          this.dataFilter.globalFilterValue = globalFilterValue;
        }
        const filteredData = this.dataFilter.filterRows(rows);
        this.dataSort.sortMeta = sortMeta;
        const sortedData = this.dataSort.sortRows(filteredData);
        const pageData = this.page(sortedData, page);
        const totalCount = sortedData.length;
        const pageCount = pageData.length;
        const result = {
          'items': pageData,
          '_meta': {
            'totalCount': totalCount,
            'pageCount': pageCount,
            'currentPage': page,
            'perPage': this.itemsPerPage
          }
        };
        return result;
      }.bind(this));
  }

  getItem(id: number): Promise<any> {
    const filterId = {
      [this.primaryKeys]: {value: id}
    };
    return this.getItems(1, filterId, null)
      .then(data => data.items[0]);
  }

  page(data: any, page: any): Array<any> {
    const start = (page - 1) * this.pageSize;
    const end = this.pageSize > -1 ? (start + this.pageSize) : data.length;
    return data.slice(start, end);
  }

  post(item: any): Promise<any> {
    // this.data.items.push(item); // exist in component
    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 250);
    });
  }

  put(item: any): Promise<any> {
    // this.data.items[this.findSelectedItemIndex(item)] = item; // exist in component
    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 250);
    });
  }

  delete(item: any): Promise<any> {
    // this.data.items.splice(this.findSelectedItemIndex(item), 1); // exist in component
    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 250);
    });
  }

  getOptions(url: string, parentId: any): Promise<any> {
    return this.http.get(url)
      .toPromise()
      .then((response: any) => {
        const result = response.filter((value: any) => {
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
