import { DataSource } from '../../ng-crud-table';
import { Filter, SortMeta } from '../../ng-data-table';

export abstract class SipTableDataSource implements DataSource {
    abstract url: string;
    abstract primaryKeys: string[];
    abstract getItems(page: number, filters: Filter, sortMeta: SortMeta[], globalFilterValue?: string): Promise<any>;
    abstract getItem(row: any): Promise<any>;
    abstract post(row: any): Promise<any>;
    abstract put(row: any): Promise<any>;
    abstract delete(row: any): Promise<any>;
    abstract getOptions?(url: string, parentId: any): Promise<any>;
}
