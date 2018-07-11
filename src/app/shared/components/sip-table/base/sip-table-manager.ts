import { Injector } from '@angular/core';
import { DataManager } from '../../ng-crud-table';
import { ColumnBase } from '../../ng-data-table/base';
import { SipDataSourceService } from '../services/sip-data-source.service';
import { SipTableDataSource } from './sip-table-data-source';
import { SipTableSettings } from './sip-table-settings';

export class SipTableManager extends DataManager {

    constructor(private injector: Injector, columns: ColumnBase[],
        settings: SipTableSettings, dataSource?: SipTableDataSource) {
        // dataSource = null;
        super(columns, settings, dataSource ? dataSource : new SipDataSourceService(injector, settings));
    }

}
