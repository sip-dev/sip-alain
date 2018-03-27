import { Component, QueryList, ContentChildren, Input, EventEmitter, Output, ContentChild, ViewContainerRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MinicolumnComponent } from './minicolumn.component';
import { ContextmenuComponent, IContextMenu } from '../menu/contextmenu.component';
import { Lib } from 'sip-lib';
import { SipComponent, SipNgDestroy, SipNgInit } from '../../../core/extends/sip-helper';
import { SipRestSqlRet, SipSqlParam } from '../../../core/services/sip-rest.service';

export interface MiniTableRow<T=any> {
    /**是否选择 */
    selected: boolean;
    /**是否编辑 */
    isEdit: boolean;
    /**索引 */
    index: number;
    /**数量 */
    count: number;
    /**数据 */
    data: T;
}

export interface MiniTableFilterEvent {
    /**值 */
    values: string[];
    /**数据 */
    items: any[];
    /**列 */
    column: MinicolumnComponent;
}

export interface IMinitableManager<T=any> {
    $table?: MinitableComponent;
    /**开始时是否自动加载数据 */
    autoLoad?: boolean;
    datas?: any[];
    connstr?: string;
    sqlId?: string;
    url?: string;
    restFun?: (this: MinitableManager<T>, params: SipSqlParam) => Observable<any>;
    pageSize?: number;
    multiSelect?: boolean;
    pageIndex?: number;
    /**选择模式，操作模式(operate)或选择模式(select)，默认operate */
    selectMode?: string;
    filterSingle?: boolean;
    /**快捷菜单定义 */
    contextmenu?: (this: MinitableManager<T>, menu: IContextMenu, row: MiniTableRow<T>[]) => void;

    /**初始化时触发，表示table已经可以使用 */
    onInit?: (this: MinitableManager<T>) => void;
    /**查询前触发，处理查询数据 */
    onSearch?: (this: MinitableManager<T>, searchParams: object) => void;
    /**排序时触发 */
    onSort?: (this: MinitableManager<T>, cols: MinicolumnComponent[]) => void;
    /**选择改变时触发 */
    onSelectChanged?: (this: MinitableManager<T>, rows: MiniTableRow<T>[]) => void;
    /**
     * 每次数据加载时触发，可以改造数据
     * @example rest.map(item=>item);
     */
    onLoaded?: (this: MinitableManager<T>, rest: Observable<SipRestSqlRet>) => void;
    /**每次数据加载完成后并处理table业务时触发 */
    onCompleted?: (this: MinitableManager<T>) => void;
    /**有过滤时触发 */
    onFilter?: (this: MinitableManager<T>, event: MiniTableFilterEvent) => void;

    /**列的下拉过滤 */
    filters?: {
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
            onFilter?: (this: MinitableManager<T>, p?: {
                /**要过滤的值 */
                values: any[];
                /**下拉数据 */
                items: any[];
                /**列信息 */
                column: MinicolumnComponent
            }) => void;
        }
    };
}

export class MinitableManager<T=any> implements IMinitableManager<T> {
    private _table: MinitableComponent;
    get $table(): MinitableComponent {
        return this._table;
    }

    /**列的下拉过滤 */
    filters?: {
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
            onFilter?: (this: MinitableManager<T>, p?: {
                /**要过滤的值 */
                values: any[];
                /**下拉数据 */
                items: any[];
                /**列信息 */
                column: MinicolumnComponent
            }) => void;
        }
    };

    filterSingle?: boolean;

    restFun: (this: MinitableManager<T>, params: SipSqlParam) => Observable<any> = null;

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

    get rows(): MiniTableRow<T>[] {
        return this._table.rows;
    }
    get columns(): MinicolumnComponent[] {
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
    get selectRows(): MiniTableRow<T>[] {
        return this._table.selectRows;
    }

    get selectDatas(): T[] {
        return this._table.selectDatas;
    }

    get selectFristData(): T {
        return this._table.selectFristData;
    }

    get selectFristRow(): MiniTableRow<T> {
        return this._table.selectFristRow;
    }
    sort(sortName: string, sortOrder: '' | 'asc' | 'desc') {
        return this._table.sort.apply(this._table, arguments);
    }

    get sortColumns(): MinicolumnComponent[] {
        return this._table.sortColumns;
    }

    /**
     * 编辑整个表格
     * @param isEdit 是否可以编辑，默认为true
     */
    editAll(isEdit: boolean = true) {
        return this._table.editCell.apply(this._table, arguments);
    }

    /**
     * 编辑列
     * @param columnIndexs 编辑列的索引, null为所有列
     * @param isEdit 是否可以编辑，默认为true
     */
    editColumn(columnIndexs: number[], isEdit: boolean = true) {
        return this._table.editColumn.apply(this._table, arguments);
    }

    /**
     * 编辑行
     * @param rowIndexs 编辑行的索引, null为所有行
     * @param isEdit 是否可以编辑，默认为true
     */
    editRow(rowIndexs: number[], isEdit: boolean = true) {
        return this._table.editRow.apply(this._table, arguments);
    }

    /**
     * 编辑单元格
     * @param rowIndexs 编辑行的索引, null为所有行
     * @param columnIndexs 编辑列的索引, null为所有列
     * @param isEdit 是否可以编辑，默认为true
     */
    editCell(rowIndexs: number[], columnIndexs: number[], isEdit: boolean = true) {
        return this._table.editCell.apply(this._table, arguments);
    }

    refresh() {
        this._table && this._table.refresh();
    }

    search(searchParams?: object) {
        this.autoLoad = true;
        this._table && this._table.search(searchParams);
    }

    constructor(private p: IMinitableManager<T>) {
    }

    private _isInit: boolean;
    $init(table: MinitableComponent) {
        if (this._isInit) return;
        this._isInit = true;

        this._table = table;
        Lib.extend(this, this.p);
        this._initEvent(this.p);
    }

    private _initEvent(p: IMinitableManager<T>) {
        Lib.eachProp(p, (item, name) => {
            if (name.indexOf('on') == 0) {
                this._table[name] && this._table[name].subscribe((p) => {
                    this[name](p);
                });
            }
        });
    }

    $pushFilters() {
        let p: IMinitableManager = this.p;
        if (p.filters) {
            let cols = this._table.columns;
            let getCol = function (name: string): MinicolumnComponent {
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

                item.onFilter && (col.filterCallback = function () { return item.onFilter.apply(this, arguments); }.bind(this));

                Lib.syncProperty(col, 'filterItems', item, 'items');

            });
        }
    }

}

@Component({
    selector: 'sip-minitable',
    templateUrl: './minitable.component.html',
    providers: [],
    styles: []
})
export class MinitableComponent extends SipComponent {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    private _manager: MinitableManager;
    public get manager(): MinitableManager {
        return this._manager;
    }
    @Input()
    public set manager(p: MinitableManager) {
        this._manager = p;
        this._manager.$init(this);
    }

    @SipNgDestroy()
    private _destroy() {
        this._manager = null;
        this._datas = this._rows = null;
    }

    private _columnQueryList: QueryList<MinicolumnComponent>;
    @ContentChildren(MinicolumnComponent)
    public get columnQueryList(): QueryList<MinicolumnComponent> {
        return this._columnQueryList;
    }
    public set columnQueryList(value: QueryList<MinicolumnComponent>) {
        this._columnQueryList = value;
        this.columns = value.toArray();
        let count = this.columns.length;
        this.columns.forEach((item, index) => {
            item.index = index
            item.count = count;
        });

        let manager: any = this._manager;
        if (manager) {
            manager.onInit();
            manager.$pushFilters()
            this._hasContextmenu = !!manager.contextmenu;
            this.isInit = true;
            //第一次加载数据
            manager.autoLoad && this._load();
        } else {
            this.isInit = true;
            //第一次加载数据
            this._load();
        }
    }
    public columns: MinicolumnComponent[];

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

    @Output() onSelectChanged = new EventEmitter<MiniTableRow[]>();
    @Output() onLoaded = new EventEmitter<Observable<SipRestSqlRet>>();
    @Output() onCompleted = new EventEmitter();

    //endregion 事件

    //#region datas and rows

    private _rows: MiniTableRow[] = [];
    public get rows(): MiniTableRow[] {
        return this._rows;
    }

    private _datas: any[] = [];
    public get datas(): any[] {
        return this._datas;
    }
    @Input() public set datas(value: any[]) {
        value || (value = []);
        let count = value.length;
        let rows: MiniTableRow[] = value.map((item, index) => {
            return {
                selected: false,
                isEdit: false,
                index: index,
                count: count,
                data: item
            };
        });
        this._rows = rows;
        this._datas = value;
        setTimeout(() => { this._checkSelectChange(); this.onCompleted.emit(); }, 50);
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
        if (restFun){
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
        this.rows.forEach(item => item.selected = seleced);
        this._refChecked();
    }

    _tiggerRowSel(row: MiniTableRow, event: any) {
        let button = event.button;
        if (button != 0 && button != 2) return;
        if (this.selectMode == "select") {
            row.selected = !row.selected;
        } else {
            if (row.selected && button == 2) return;
            if (!event.ctrlKey) {
                this.rows.forEach(item => item.selected = false);
                row.selected = true;
            } else
                row.selected = !row.selected;
        }
        this._refChecked();
    }

    selectIndex(indexs: number[], seleced?: boolean) {
        if (indexs.length == 0) return;
        seleced = (seleced !== false);
        let rows = this.rows
        indexs.forEach(item => {
            rows[item].selected = seleced;
        });
        this._refChecked();
    }

    get selectRows(): MiniTableRow[] {
        return this.rows.filter(item => item.selected);
    }

    get selectFristRow(): MiniTableRow {
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
        const checkedCount = this.rows.filter(w => w.selected).length;
        this._allSelected = checkedCount === this.rows.length;
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

    get sortColumns(): MinicolumnComponent[] {
        return this.columns.filter(item => item.sortOrder);
    }

    @Output() onSort = new EventEmitter<MinicolumnComponent[]>();

    //#endregion sort

    //#region filter

    @Output() onFilter = new EventEmitter<MiniTableFilterEvent>();

    _filter(column: MinicolumnComponent) {
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

    _filterSingleChange(column: MinicolumnComponent, filter: any) {
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
     * 编辑单元格
     * @param rowIndexs 编辑行的索引, null为所有行
     * @param columnIndexs 编辑列的索引, null为所有列
     * @param isEdit 是否可以编辑，默认为true
     */
    editCell(rowIndexs: number[], columnIndexs: number[], isEdit: boolean = true) {
        let rows = this.rows;
        if (!rowIndexs)
            rows.forEach(item => item.isEdit = isEdit);
        else
            rowIndexs.forEach(index => rows[index].isEdit = isEdit);

        let columns = this.columns;
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
