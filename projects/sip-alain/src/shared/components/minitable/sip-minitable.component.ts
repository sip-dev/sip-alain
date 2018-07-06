import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Lib } from 'sip-lib';
import { IContextMenu } from '../../../core/extends/sip-contextmenu';
import { SipComponent, SipNgDestroy } from '../../../core/extends/sip-helper';
import { SipRestSqlRet, SipSqlParam } from '../../../core/services/sip-rest.service';
import { SipMinicolumnComponent } from './sip-minicolumn.component';


export interface SipMiniTableRowColumn { index: number; isEdit: boolean; }

export interface SipMiniTableRow<T=any> {
    /**是否选择 */
    selected: boolean;
    /**是否编辑 */
    isEdit: boolean;
    /**索引 */
    index: number;
    /**数量 */
    count: number;
    columns: SipMiniTableRowColumn[];
    tree: {
        expand: boolean;
        isShow: () => boolean;
        collapse: (expand: boolean) => void;
    };
    /**数据 */
    data: T;
    children: SipMiniTableRow<T>[];
    expands?: SipMiniTableRow<T>[];
}

export interface SipMiniTableTreeOpt<T=any> {
    /**展开数据字段，内容为数组，如: children */
    childName?: string;
    /**确定是否可以展开字段，跟load配合使用(动态加载展开数据) */
    existName?: string;
    /**加载展开数据,之前最好配合exits确定是否可以展开 */
    load?: (row: SipMiniTableRow<T>) => Observable<T[]>
}

export interface SipMiniTableFilterOpt<T=any> {
    [prop: string]: {
        /**下拉数据 */
        items?: any[],
        /**显示字段名称 */
        textName?: string,
        /**值字段名称 */
        valueName?: string,
        /**默认值 */
        defaultValue?: any[],
        /**过滤处理事件 */
        onFilter?: (this: SipMinitableManager<T>, p?: {
            /**要过滤的值 */
            values: any[];
            /**下拉数据 */
            items: any[];
            /**列信息 */
            column: SipMinicolumnComponent
        }) => void;
    }
}

export interface SipMiniTableFilterEvent {
    /**值 */
    values: string[];
    /**数据 */
    items: any[];
    /**列 */
    column: SipMinicolumnComponent;
}

export interface ISipMinitableManager<T=any> {
    $table?: SipMinitableComponent;
    /**开始时是否自动加载数据 */
    autoLoad?: boolean;
    datas?: any[];
    connstr?: string;
    sqlId?: string;
    url?: string;
    restFun?: (this: SipMinitableManager<T>, params: SipSqlParam) => Observable<any>;
    pageSize?: number;
    multiSelect?: boolean;
    pageIndex?: number;
    /**选择模式，操作模式(operate)或选择模式(select)，默认operate */
    selectMode?: string;
    filterSingle?: boolean;
    /**快捷菜单定义 */
    contextmenu?: (this: SipMinitableManager<T>, menu: IContextMenu, row: SipMiniTableRow<T>[]) => void;
    tree?: SipMiniTableTreeOpt<T>;

    /**初始化时触发，表示table已经可以使用 */
    onInit?: (this: SipMinitableManager<T>) => void;
    /**查询前触发，处理查询数据 */
    onSearch?: (this: SipMinitableManager<T>, searchParams: object) => void;
    /**排序时触发 */
    onSort?: (this: SipMinitableManager<T>, cols: SipMinicolumnComponent[]) => void;
    /**选择改变时触发 */
    onSelectChanged?: (this: SipMinitableManager<T>, rows: SipMiniTableRow<T>[]) => void;
    /**
     * 每次数据加载时触发，可以改造数据
     * @example rest.map(item=>item);
     */
    onLoaded?: (this: SipMinitableManager<T>, rest: Observable<SipRestSqlRet<T>>) => void;
    /**每次数据加载完成后并处理table业务时触发 */
    onCompleted?: (this: SipMinitableManager<T>) => void;
    /**有过滤时触发 */
    onFilter?: (this: SipMinitableManager<T>, event: SipMiniTableFilterEvent) => void;

    /**列的下拉过滤 */
    filters?: SipMiniTableFilterOpt<T>;
}

export class SipMinitableManager<T=any> implements ISipMinitableManager<T> {
    private _table: SipMinitableComponent;
    get $table(): SipMinitableComponent {
        return this._table;
    }
    tree?: SipMiniTableTreeOpt<T>;

    /**列的下拉过滤 */
    filters?: SipMiniTableFilterOpt<T>;

    filterSingle?: boolean;

    restFun: (this: SipMinitableManager<T>, params: SipSqlParam) => Observable<any> = null;

    onInit() { };

    /**开始时是否自动加载数据 */
    autoLoad = false;

    get pageSize(): number {
        return this._table.pageSize;
    }
    set pageSize(value: number) {
        this._table.pageSize = value;
    }

    get pageIndex(): number {
        return this._table.pageIndex;
    }
    set pageIndex(value: number) {
        this._table.pageIndex = value;
    }

    get multiSelect(): boolean {
        return this._table.multiSelect;
    }
    set multiSelect(value: boolean) {
        this._table.multiSelect = value;
    }

    get connstr(): string {
        return this._table.connstr;
    }
    set connstr(value: string) {
        this._table.connstr = value;
    }

    get sqlId(): string {
        return this._table.sqlId;
    }
    set sqlId(value: string) {
        this._table.sqlId = value;
    }

    get url(): string {
        return this._table.url;
    }
    set url(value: string) {
        this._table.url = value;
    }

    get selectMode(): string {
        return this._table.selectMode;
    }
    set selectMode(value: string) {
        this._table.selectMode = value;
    }

    get rows(): SipMiniTableRow<T>[] {
        return this._table.rows;
    }
    get columns(): SipMinicolumnComponent[] {
        return this._table.columns;
    }

    get datas(): T[] {
        return this._table.datas;
    }
    set datas(datas: T[]) {
        this._table.datas = datas;
    }

    selectAll(seleced?: boolean) {
        return this._table.selectAll.apply(this._table, arguments);
    }
    selectIndex(indexs: number[], seleced?: boolean) {
        return this._table.selectIndex.apply(this._table, arguments);
    }
    get selectRows(): SipMiniTableRow<T>[] {
        return this._table.selectRows;
    }

    get selectDatas(): T[] {
        return this._table.selectDatas;
    }

    get selectFristData(): T {
        return this._table.selectFristData;
    }

    get selectFristRow(): SipMiniTableRow<T> {
        return this._table.selectFristRow;
    }
    sort(sortName: string, sortOrder: '' | 'asc' | 'desc') {
        return this._table.sort.apply(this._table, arguments);
    }

    get sortColumns(): SipMinicolumnComponent[] {
        return this._table.sortColumns;
    }

    /**
     * 编辑整个表格
     * @param isEdit 是否可以编辑，默认为true
     */
    editAll(isEdit?: boolean) {
        return this._table.editCell.apply(this._table, arguments);
    }

    /**
     * 编辑列
     * @param columnIndexs 编辑列的索引, null为所有列
     * @param isEdit 是否可以编辑，默认为true
     */
    editColumn(columnIndexs: number[], isEdit?: boolean) {
        return this._table.editColumn.apply(this._table, arguments);
    }

    /**
     * 编辑行
     * @param rowIndexs 编辑行的索引, null为所有行
     * @param isEdit 是否可以编辑，默认为true
     */
    editRow(rowIndexs: number[], isEdit?: boolean) {
        return this._table.editRow.apply(this._table, arguments);
    }

    /**
     * 是否编辑cell
     * @param rowIndex 
     * @param columnIndex 
     */
    isEditCell(rowIndex: number, columnIndex: number) {
        return this._table.isEditCell(rowIndex, columnIndex);
    }

    /**
     * 编辑单元格
     * @param rowIndexs 编辑行的索引, null为所有行
     * @param columnIndexs 编辑列的索引, null为所有列
     * @param isEdit 是否可以编辑，默认为true
     */
    editCell(rowIndexs: number[], columnIndexs: number[], isEdit?: boolean) {
        return this._table.editCell.apply(this._table, arguments);
    }

    refresh() {
        this._table && this._table.refresh();
    }

    search(searchParams?: object) {
        this.autoLoad = true;
        this._table && this._table.search(searchParams);
    }

    constructor(private p: ISipMinitableManager<T>) {
    }

    private _isInit: boolean;
    $init(table: SipMinitableComponent) {
        if (this._isInit) return;
        this._isInit = true;

        this._table = table;
        Lib.extend(this, this.p);
        this._initEvent(this.p);
    }

    private _initEvent(p: ISipMinitableManager<T>) {
        Lib.eachProp(p, (item, name) => {
            if (name.indexOf('on') == 0) {
                this._table[name] && this._table[name].subscribe((p) => {
                    this[name](p);
                });
            }
        });
    }

    $pushFilters() {
        let p: ISipMinitableManager = this.p;
        if (p.filters) {
            let cols = this._table.columns;
            let getCol = function (name: string): SipMinicolumnComponent {
                return cols.find(function (item) { return item.name == name; });
            };
            Lib.eachProp(p.filters, (item, name) => {
                let col = getCol(name);
                if (!col) throw new Error('没有列：' + name);

                item.valueName || (item.valueName = 'value');
                item.textName || (item.textName = 'text');

                Lib.syncProperty(col, 'filterValueName', item, 'valueName');
                Lib.syncProperty(col, 'filterTextName', item, 'textName');
                Lib.syncProperty(col, 'filterDefault', item, 'defaultValue');

                col.filterCallback = (p) => {
                    if (item.onFilter)
                        return item.onFilter.call(this, p);
                    else {
                        let values = p.values;
                        this.search({ PRDT_STATUS: values.join(',') });
                    }
                };

                Lib.syncProperty(col, 'filterItems', item, 'items');

            });
        }
    }

}

@Component({
    selector: 'sip-minitable',
    templateUrl: './sip-minitable.component.html',
    providers: [],
    styles: []
})
export class SipMinitableComponent extends SipComponent {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    private _manager: SipMinitableManager;
    public get manager(): SipMinitableManager {
        return this._manager;
    }
    @Input()
    public set manager(p: SipMinitableManager) {
        this._manager = p;
        this._manager.$init(this);
    }

    @SipNgDestroy()
    private _destroy() {
        this._manager = null;
        this._datas = this._rows = null;
    }

    private _columnQueryList: QueryList<SipMinicolumnComponent>;
    @ContentChildren(SipMinicolumnComponent)
    public get columnQueryList(): QueryList<SipMinicolumnComponent> {
        return this._columnQueryList;
    }
    public set columnQueryList(value: QueryList<SipMinicolumnComponent>) {
        this._columnQueryList = value;
        let columns = this.columns = value.toArray();
        let count = columns.length;
        columns.forEach((item, index) => {
            item.index = index
            item.count = count;
        });

        if (!this.isInit) {
            this.isInit = true;
            //处理rows.columns数据， 防止没初始化
            let rows = this._allRows;
            if (rows && rows.length > 0 && !rows[0].columns) {
                rows.forEach(function (row) {
                    row.columns = columns.map(function (item) {
                        return { index: item.index, isEdit: false };
                    })
                });
            }
            let manager: any = this._manager;
            if (manager) {
                manager.onInit();
                manager.$pushFilters()
                this._hasContextmenu = !!manager.contextmenu;
                //第一次加载数据
                manager.autoLoad && this._load();
            } else {
                //第一次加载数据
                this._load();
            }
        }
    }
    public columns: SipMinicolumnComponent[];

    _hasContextmenu = false;
    _showContextmenu(menu) {
        let manager: any = this._manager;
        if (!manager || !this._hasContextmenu) return;
        menu.items = [];
        manager.contextmenu(menu, this.selectRows);
        if (!menu.width) menu.width = '140px';
    }

    //#region 参数

    @Input() url = '';
    @Input() connstr = '';
    @Input() sqlId = '';
    @Input() pageIndex = 1;
    @Input() pageSize = this.$config.minitable.pageSize;
    @Input() total = 0; // mock total
    //是否支持多选
    @Input() multiSelect = this.$config.minitable.multiSelect;
    /**
     * 选择模式，分别是操作模式(operate)和选择模式(select)，默认operate
     */
    @Input() selectMode = this.$config.minitable.selectMode;

    @Input() filterSingle = this.$config.minitable.filterSingle !== false;

    //#endregion 参数

    //region 事件

    @Output() onSelectChanged = new EventEmitter<SipMiniTableRow[]>();
    @Output() onLoaded = new EventEmitter<Observable<SipRestSqlRet>>();
    @Output() onCompleted = new EventEmitter();

    //endregion 事件

    //#region datas and rows

    private _rows: SipMiniTableRow[] = [];
    public get rows(): SipMiniTableRow[] {
        return this._rows;
    }

    private _allRows: SipMiniTableRow[] = [];
    private _resetAllRows(rows?: SipMiniTableRow[]) {
        let isFirst = arguments.length <= 0;
        if (isFirst) {
            if (!this.manager.tree) {
                this._allRows = this.rows;
                return;
            }
            rows = this.rows;
            this._allRows = [];
        }
        let list = this._allRows;
        rows.forEach((p) => {
            list.push(p);
            if (p.children) this._resetAllRows(p.children);
        });
        if (isFirst) {
            let count = list.length;
            list.forEach((p, idx) => {
                p.count = count;
                p.index = idx;
            });
            this._refChecked();
        }
    }

    private _datas: any[] = [];
    public get datas(): any[] {
        return this._datas;
    }
    @Input() public set datas(value: any[]) {
        value || (value = []);
        let rows: SipMiniTableRow[] = this._makeRows(value);
        this._rows = rows;
        this._resetAllRows();
        this._datas = value;
        setTimeout(() => { this._checkSelectChange(); this.onCompleted.emit(); }, 50);
    }

    private _makeRows(datas: any[]): SipMiniTableRow[] {
        let count = datas.length;
        let columns = this.columns;
        let hasCol = !!columns;
        let isTree = null;
        let rows: SipMiniTableRow[] = datas.map((item: SipMiniTableRow, index) => {
            let setChild = (children) => {
                row.children = children;
                this._resetAllRows();
            };
            let row = {
                selected: false,
                isEdit: false,
                index: index,
                count: count,
                columns: hasCol ? columns.map(function (item) {
                    return { index: item.index, isEdit: false };
                }) : null,
                tree: {
                    isShow: () => {
                        let tree = this.manager.tree;
                        if (!tree) return false;
                        let childName = tree.childName;
                        if (childName) {
                            let cList = item && item[childName];
                            return cList ? cList.length > 0 : false;
                        } else if (tree.existName && tree.load) {
                            return item ? item[tree.existName] : false;
                        }
                        return false;
                    },
                    collapse: (expand: boolean) => {
                        if (expand) {
                            let tree = this.manager.tree;
                            if (tree.childName)
                                setChild(this._makeRows(item[tree.childName]));
                            else if (tree.load) {
                                tree.load(row).subscribe((p) => {
                                    setChild(this._makeRows(p));
                                });
                            }
                        } else {
                            setChild(null);
                        }
                    },
                    expand: false
                },
                children: null,
                data: item
            };
            return row;
        });
        return rows;
    }

    //#endregion

    private isInit = false;
    // @SipNgInit()
    // private init() {
    // }

    _loading = false;
    _load() {
        if (!this.isInit) return;
        if (this._loading) return;
        this._loading = true;
        this._allSelected = false;
        this._indeterminate = false;
        let restFun = this._manager ? this._manager.restFun : null;
        if (!this.sqlId && !this.url && !restFun) {
            setTimeout(() => {
                this._loading = false;
                this.total = this.datas ? this.datas.length : 0;
                // this.onCompleted.emit()
            }, 1);
            return;
        }

        let sorts = this.sortColumns.map(item => {
            let name = item.sortName || item.name;
            let order = item.sortOrder;
            return [name, order].join(' ');
        });
        let searchParams = {};
        this.onSearch.emit(searchParams);
        Lib.extend(searchParams, this._searchParams);

        let sqlParams: SipSqlParam = {
            sortName: sorts.length > 0 ? sorts.join(',') : '',
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            sortOrder: '',
            searchparam: searchParams
        };
        let rest;
        if (restFun) {
            rest = restFun.call(this._manager, sqlParams);
        } else {
            Lib.extend(sqlParams, {
                url: this.url,
                connstr: this.connstr,
                sqlId: this.sqlId,
            });
            rest = this.$httpSrv.sql(sqlParams);
        }

        this.onLoaded.emit(rest);
        rest.subscribe((rs) => {
            this.datas = rs.datas || [];
            this.total = rs.total;
            this._loading = false;
            // setTimeout(() => this.onCompleted.emit(), 50);
        });

    }

    //#region select and checked

    _indeterminate = false;
    _allSelected = false;

    _tiggerRowSelAll() {
        this.selectAll(this._allSelected);
    }

    selectAll(seleced?: boolean) {
        seleced = (seleced !== false);
        this._allRows.forEach(item => item.selected = seleced);
        this._refChecked();
    }

    _tiggerRowSel(row: SipMiniTableRow, event: any) {
        let button = event.button;
        if (button != 0 && button != 2) return;
        if (this.selectMode == "select") {
            row.selected = !row.selected;
        } else {
            if (row.selected && button == 2) return;
            if (!event.ctrlKey) {
                this._allRows.forEach(item => item.selected = false);
                row.selected = true;
            } else
                row.selected = !row.selected;
        }
        this._refChecked();
    }

    _tiggerRowSelBySel(row: SipMiniTableRow, event: any) {
        if (/td/i.test(event.target.tagName)) {
            row.selected = !row.selected
        }
    }

    selectIndex(indexs: number[], seleced?: boolean) {
        if (indexs.length == 0) return;
        seleced = (seleced !== false);
        let rows = this._allRows
        indexs.forEach(item => {
            rows[item].selected = seleced;
        });
        this._refChecked();
    }

    get selectRows(): SipMiniTableRow[] {
        return this._allRows.filter(item => item.selected);
    }

    get selectFristRow(): SipMiniTableRow {
        let rows = this.selectRows;
        return rows.length > 0 ? rows[0] : null;
    }

    get selectDatas(): any[] {
        return this.selectRows.map((item) => { return item.data; });
    }

    get selectFristData(): any {
        let row = this.selectFristRow;
        return row && row.data;
    }

    _refChecked() {
        const checkedCount = this._allRows.filter(w => w.selected).length;
        this._allSelected = checkedCount === this._allRows.length;
        this._indeterminate = this._allSelected ? false : checkedCount > 0;
        this._checkSelectChange();
    }

    private _select_org = '';
    private _checkSelectChange() {
        let selectRows = this.selectRows;
        let selectIndexs = selectRows.map(item => item.index);
        if (selectIndexs.join(',') != this._select_org) {
            this._select_org = selectIndexs.join(',');
            this.onSelectChanged.emit(selectRows);
        }

    }

    //#endregion

    expand(rows: SipMiniTableRow[], expand?: boolean) {
        if (!this.manager.tree) return;
        arguments.length == 1 && (expand = true);
        rows.forEach((p) => { p.tree.collapse(true); })
    }

    //#region sort

    /**
     * 排序内部用
     */
    _sortIn() {
        this._load();
        this.onSort.emit(this.sortColumns);
    }
    /**
     * 排序
     * @param sortName 排序字段名称
     * @param sortOrder 排序方向, 可以值为('' | asc | desc)
     */
    sort(sortName: string, sortOrder: '' | 'asc' | 'desc') {
        let cols = this.columns.filter(item => (item.sortName || item.name) == sortName);
        if (cols.length > 0) cols[0].sortOrder = sortOrder;
        this._load();
        this.onSort.emit(this.sortColumns);
    }

    get sortColumns(): SipMinicolumnComponent[] {
        return this.columns.filter(item => item.sortOrder);
    }

    @Output() onSort = new EventEmitter<SipMinicolumnComponent[]>();

    //#endregion sort

    //#region filter

    @Output() onFilter = new EventEmitter<SipMiniTableFilterEvent>();

    _filter(column: SipMinicolumnComponent) {
        let items = column.selectFilterItems;
        let values = items.map(item => item[column.filterValueName]);
        let p = {
            values: values,
            items: items,
            column: column
        };
        column.filterCallback && column.filterCallback(p)
        this.onFilter.emit(p);
    }

    _filterSingleChange(column: SipMinicolumnComponent, filter: any) {
        // if (filter._filtersel) return;
        let filterList = column.filterItems;
        filterList.forEach((p) => { p._filtersel = false; });
        filter._filtersel = true;
        this._filter(column);
    }

    //#endregion

    //#region editor

    /**
     * 编辑整个表格
     * @param isEdit 是否可以编辑，默认为true
     */
    editAll(isEdit: boolean = true) {
        this.editCell(null, null, isEdit);
    }

    /**
     * 编辑列
     * @param columnIndexs 编辑列的索引, null为所有列
     * @param isEdit 是否可以编辑，默认为true
     */
    editColumn(columnIndexs: number[], isEdit: boolean = true) {
        this.editCell(null, columnIndexs, isEdit);
    }

    /**
     * 编辑行
     * @param rowIndexs 编辑行的索引, null为所有行
     * @param isEdit 是否可以编辑，默认为true
     */
    editRow(rowIndexs: number[], isEdit: boolean = true) {
        this.editCell(rowIndexs, null, isEdit);
    }

    /**
     * 是否编辑cell
     * @param rowIndex 
     * @param columnIndex 
     */
    isEditCell(rowIndex: number, columnIndex: number) {
        return this._isEditCell(this._allRows[rowIndex], columnIndex);
    }

    _isEditCell(row: SipMiniTableRow<any>, columnIndex: number) {
        return row.isEdit && row.columns[columnIndex].isEdit;
    }

    /**
     * 编辑单元格
     * @param rowIndexs 编辑行的索引, null为所有行
     * @param columnIndexs 编辑列的索引, null为所有列
     * @param isEdit 是否可以编辑，默认为true
     */
    editCell(rowIndexs: number[], columnIndexs: number[], isEdit: boolean = true) {
        let rows = this._allRows;
        if (!rowIndexs)
            rows.forEach(item => {
                item.isEdit = isEdit;
                this._makeEditRowColumns(item, columnIndexs, isEdit);
            });
        else
            rowIndexs.forEach(index => {
                let item = rows[index];
                item.isEdit = isEdit;
                this._makeEditRowColumns(item, columnIndexs, isEdit);
            });
    }

    private _makeEditRowColumns(row: SipMiniTableRow<any>, columnIndexs: number[], isEdit: boolean) {
        let columns = row.columns;
        if (!columnIndexs) {
            columns.forEach(item => item.isEdit = isEdit);
        } else
            columnIndexs.forEach(index => columns[index].isEdit = isEdit);
    }

    private _oldpageIndex = 1;
    _changePageIndex() {
        if (this.pageIndex == this._oldpageIndex) return;
        this._oldpageIndex = this.pageIndex;
        this._load();
    }

    @Output() onSearch = new EventEmitter<object>();
    private _searchParams: object;
    search(searchParams?: object) {
        this._searchParams = Lib.extend(this._searchParams || {}, searchParams);
        this.pageIndex = 1;
        this._load();
    }

    refresh() {
        this._load();
    }

    _width = '';
    //#endregion
}
