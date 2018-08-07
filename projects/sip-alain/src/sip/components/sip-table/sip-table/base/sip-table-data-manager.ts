import { Injector } from '@angular/core';
import { SipDataTable } from './sip-data-table';
import { SipTableColumn } from './sip-table-column';
import { SipTableSettings } from './sip-table-settings';

export class SipTableDataManager<T=object> extends SipDataTable<T> {

    constructor(injector: Injector, columns: SipTableColumn[],
        settings: SipTableSettings) {
        super(columns, settings, null, injector);
    }

}
