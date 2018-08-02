import { Observable } from 'rxjs';
import { ISipContextMenu } from '../../../../base/i-sip-context-menu';
import { ISipRestSqlDefParams } from '../../../../help/sip-helper';
import { CellEventArgs, Row, Settings, TreeNode } from '../../ng-data-table';

export class SipTableSettings extends Settings {

    url?: string;
    connstr?: string;
    sqlId?: string;
    pageSize?: number = 10;
    pageIndex?: number;
    sortName?: string;
    sortOrder?: '' | 'asc' | 'desc';
    searchparam?: object;
    restSrv?:(param: ISipRestSqlDefParams<any>)=>Observable<any>;

    /**id字段, 默认为id */
    treeIdField?: string;
    /**name字段，默认为name */
    treeNameField?: string;
    /**叶子字段，值为false表示有子节点（不是叶子） */
    treeLeafField?:string;
    /**ParentId字段，默认为parentId */
    treeParentIdField?: string;
    /**children字段, 默认为空，如果有内容表示子节点数据 */
    treeChildrenField?: string;
    /**初始数据 */
    treeDatas?: any[];
    /**自定义节点内容 */
    treeNodes?: (node?: TreeNode) => Promise<TreeNode[]>;

    contextmenuAction?: (event: CellEventArgs, row: Row) => ISipContextMenu;

    constructor(init?: Partial<SipTableSettings>) {
        super(init);
        this.api || (this.api = this.url);
        this.contextmenuAction && (this.contextMenu = true);
    }
}
