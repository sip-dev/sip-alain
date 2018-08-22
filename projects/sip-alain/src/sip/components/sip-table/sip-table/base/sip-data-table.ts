import { Injector } from '@angular/core';
import { Lib } from 'sip-lib';
import { SipContextMenuService } from '../../../../services/sip-context-menu.service';
import { ColumnBase } from '../../ng-data-table/base/column-base';
import { DataTable } from '../../ng-data-table/base/data-table';
import { Message } from '../../ng-data-table/base/message';
import { SipRow } from './sip-row';
import { SipTableSettings } from './sip-table-settings';

/**扩展 到 TreeTable和DataManager */
export class SipDataTable<T> extends DataTable {

    constructor(columns: ColumnBase[], settings: SipTableSettings, messages?: Message,
        public readonly injector?: Injector) {
        super(columns, settings, messages);

        if (settings) {

            settings.clientSide = true;

            let sortName = settings.sortName;
            if (sortName) {
                let sortOrder = settings.sortOrder == 'asc' ? 1 : -1;
                this.sorter.sortMeta.push({ field: sortName, order: sortOrder });
            }

            this._isEditMode = settings.editMode === 'editProgrammatically';
            if (this._isEditMode) {
                /**翻页时取消所有cell编辑状态 */
                this.events.pageSource$.subscribe((p) => {
                    this.unEditCellAll();
                });
            }
            if (settings.contextmenuAction) {
                let contextmenu = injector.get(SipContextMenuService);
                this.events.contextMenuSource$.subscribe((e) => {
                    let row = this.getRows()[e.rowIndex];
                    let ct = settings.contextmenuAction(e, row);
                    return contextmenu.show(ct, e.event);
                });
            }
        }

        // this.onSelectChanged = this.events.selectionSource$;
        // this.onScroll= this.events.scrollSource$;
        // this.onPageChanaged = this.events.pageSource$;
        // this.onSort = this.events.sortSource$;
        // this.onActivateCell = this.events.activateCellSource$;
        // this.onCellEditMode = this.events.cellEditModeSource$;
        // this.onClickCell = this.events.clickCellSource$;
        // this.onDblClickCell = this.events.dblClickCellSource$;
        // this.onContextMenu = this.events.contextMenuSource$;
        // this.onResizeBegin = this.events.resizeBeginSource$;
        // this.onResizeEnd = this.events.resizeEndSource$;
        // this.onResize = this.events.resizeSource$;
    }

    // readonly onSelectChanged:Observable<any>;
    // readonly onScroll:Observable<any>;
    // readonly onPageChanaged:Observable<any>;
    // readonly onSort:Observable<any>;
    // readonly onActivateCell:Observable<CellEventArgs>;
    // readonly onCellEditMode:Observable<CellEventArgs>;
    // readonly onClickCell:Observable<CellEventArgs>;
    // readonly onDblClickCell:Observable<CellEventArgs>;
    // readonly onContextMenu:Observable<CellEventArgs>;
    // readonly onResizeBegin:Observable<any>;
    // readonly onResize:Observable<any>;
    // readonly onResizeEnd:Observable<any>;

    //#region rows && datas

    public get datas(): T[] {
        return this._rowToDataList(this.rows);
    }
    public set datas(value: T[]) {
        this.rows = value;
    }

    private _rowToData(row: SipRow<T>): T {
        return row ? row.$$data : null;
    }

    private _rowToDataList(rows: SipRow<T>[]): T[] {
        return !rows ? [] : rows.map((item) => this._rowToData(item));
    }

    /**
     * 根据属性值，获取row
     * @param propName 
     * @param value 
     * @example getRow('id', '1111');
     */
    getRow(propName: string, value: any): SipRow<T> {
        let rows: SipRow<T>[] = <any[]>this.getRows();

        return rows.find((item) => { return item.$$data[propName] == value; });
    }

    /**
     * 根据属性值，获取data
     * @param propName 
     * @param value 
     * @example getData('id', '1111');
     */
    getData(propName: string, value: any): T {
        let row = this.getRow(propName, value);
        return row ? row.$$data : null;
    }

    /**
     * 获取选择的行
     */
    getSelectedRows(): SipRow<T>[] {
        let rows = this.getSelection() || [];
        return Lib.isArray(rows) ? rows : [rows];
    }

    /**
     * 获取选择的行数据
     */
    getSelectedDatas(): T[] {
        return this._rowToDataList(this.getSelectedRows());
    }

    /**
     * 获取第一个选择行
     */
    getSelectedFirstRow(): SipRow<T> {
        let rows = this.getSelectedRows();
        return rows && rows.length > 0 ? rows[0] : null;
    }

    /**
     * 获取第一个选择行数据
     */
    getSelectedFirstData(): T {
        return this._rowToData(this.getSelectedFirstRow());
    }

    //#endregion rows && datas

    //#region editCell

    private _isEditMode: boolean;
    private _isEditing: boolean;
    /**是否编辑状态, 需要unEditCellAll()取消状态 */
    public get isEditing(): boolean {
        return this._isEditing;
    }
    /**
     * 设置cell编辑状态， 需要设置setting.editMode: 'editProgrammatically'
     * @param rowIndex 行（索引）
     * @param columnIndex 列（索引）
     * @param editMode 是否编辑
     */
    editCell(rowIndex: number, columnIndex: number, editMode: boolean) {
        if (this._isEditMode && editMode) {
            this._isEditing = true;
        }
        super.editCell(rowIndex, columnIndex, editMode);
    }

    /**取消所有cell编辑状态 */
    unEditCellAll() {
        if (!this._isEditing) return false;
        this._isEditing = false;
        let rows = this.getRows();
        let cols = this.columns;
        let rowCount = rows ? rows.length : 0;
        let colCount = cols ? cols.length : 0;
        if (rowCount == 0 || colCount == 0) return;
        for (let rowIndex = rowCount - 1; rowIndex > -1; rowIndex--) {
            for (let colIndex = colCount - 1; colIndex > -1; colIndex--) {
                this.editCell(rowIndex, colIndex, false);
            }
        }
    }
    //#endregion editCell

}
