import { ISipContextMenu } from 'sip-alain';
import { CellEventArgs, Row, Settings } from '../../ng-data-table';

export class SipTableSettings extends Settings {

    url?: string;
    connstr?: string;
    sqlId?: string;
    pageSize?: number = 10;
    pageIndex?: number;
    sortName?: string;
    sortOrder?: '' | 'asc' | 'desc';
    searchparam?: object;

    contextmenuAction?: (event: CellEventArgs, row: Row) => ISipContextMenu;

    constructor(init?: Partial<SipTableSettings>) {
        super(init);
        this.api || (this.api = this.url);
        this.primaryKeys || (this.primaryKeys = ['id']);
        this.contextmenuAction && (this.contextMenu = true);
    }
}
