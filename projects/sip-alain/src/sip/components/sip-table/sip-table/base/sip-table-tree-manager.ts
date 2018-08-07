import { Injector } from '@angular/core';
import { TreeTable } from '../../ng-tree-table';
import { SipTreeDataSource } from '../base';
import { SipTableTreeSourceService } from '../services/sip-table-tree-source.service';
import { SipTableColumn } from './sip-table-column';
import { SipTableSettings } from './sip-table-settings';

export class SipTableTreeManager<T=object> extends TreeTable<T> {

    readonly dataSource: SipTreeDataSource;
    // onSetRows: EventEmitter<TreeNode[]>;

    constructor(public injector: Injector, columns: SipTableColumn[],
        settings: SipTableSettings, source?: SipTreeDataSource) {
        super(columns, settings, source = source || new SipTableTreeSourceService(injector, settings));

        this.dataSource = source;
    }

    public get datas(): T[] {
        let nodes = this.nodes;
        return !nodes ? [] : nodes.map(item => item.data);
    }
    public set datas(value: T[]) {
        this.nodes = this.dataSource.toTreeNodes(value);
    }

}
