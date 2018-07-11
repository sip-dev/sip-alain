import { Settings } from '../../ng-data-table';

export class SipTableSettings extends Settings {

    url?: string;
    connstr?: string;
    sqlId?: string;
    pageSize?: number = 10;
    pageIndex?: number;
    sortName?: string;
    sortOrder?: '' | 'asc' | 'desc';
    searchparam?: object;

    constructor(init?: Partial<SipTableSettings>) {
        super(init);
        this.api || (this.api = this.url);
    }
}
