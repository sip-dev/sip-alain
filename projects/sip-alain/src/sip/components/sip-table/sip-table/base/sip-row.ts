import { Row } from "../../ng-data-table";

export interface SipRow<T=object> extends Row {
    $$data: T;
}