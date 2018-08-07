import { Injector } from '@angular/core';
import { DataManager } from '../../ng-crud-table';
import { SipTableServerSourceService } from '../services/sip-table-server-source.service';
import { SipTableColumn } from './sip-table-column';
import { SipTableDataSource } from './sip-table-data-source';
import { SipTableSettings } from './sip-table-settings';

export class SipTableServerManager<T=object> extends DataManager<T> {


    constructor(public injector: Injector, columns: SipTableColumn[],
        settings: SipTableSettings, source?: SipTableDataSource) {
        super(columns, settings, source || new SipTableServerSourceService(injector, settings), null, injector);
    }

    public get dataSource(): SipTableDataSource {
        return this.service;
    }

    refresh() {
        this.getItems().then();
    }

    search(searchparams?: object) {
        this.dataSource.searchparams = searchparams;
        this.refresh();
    }

}
