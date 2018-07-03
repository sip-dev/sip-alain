import {SortMeta} from '../types';
import {Settings} from './settings';

export class DataSort {

  public multiple: boolean;
  public sortMeta: SortMeta[] = [];

  constructor(private settings: Settings) {
    this.multiple = this.settings.multipleSort;
  }

  setOrder(columnName: string) {
    const index = this.sortMeta.findIndex((x: SortMeta) => x.field === columnName);
    if (index === -1) {
      if (!this.multiple) {
        this.sortMeta = [];
      }
      this.sortMeta.push(<SortMeta>{field: columnName, order: 1});
    } else if (this.sortMeta[index].order === 1) {
      this.sortMeta[index].order = -1;
    } else if (this.sortMeta[index].order === -1) {
      this.sortMeta.splice(index, 1);
    }
  }

  getOrder(columnName: string) {
    const meta = this.findSortMeta(columnName);
    return (meta) ? meta.order : 0;
  }

  findSortMeta(columnName: string): SortMeta {
    return this.sortMeta.find((meta: SortMeta) => meta.field === columnName);
  }

  sortRows(data: any[]): any[] {
    if (!data) {
      return [];
    }
    if (!this.sortMeta || !this.sortMeta.length) {
      return data;
    }
    return data.sort((previous, current) => {
      return this.multiSort(previous, current, this.sortMeta, 0);
    });
  }

  multiSort(previous: any, current: any, meta: SortMeta[], index: number) {
    const value1 = previous[meta[index].field];
    const value2 = current[meta[index].field];
    const result = (value1 < value2) ? -1 : 1;

    if (value1 === value2) {
      return (meta.length - 1) > (index) ? (this.multiSort(previous, current, meta, index + 1)) : 0;
    }

    return (meta[index].order * result);
  }

  clear() {
    this.sortMeta = [];
  }

  getDirection(columnName: string) {
    let icon: string;
    if (this.getOrder(columnName) === -1) {
      icon = 'desc';
    } else if (this.getOrder(columnName) === 1) {
      icon = 'asc';
    } else {
      icon = '';
    }
    return icon;
  }

}
