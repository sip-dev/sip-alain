import { Injector } from '@angular/core';
import { SipContextMenuService } from 'sip-alain';
import { Lib } from 'sip-lib';
import { DataManager } from '../../ng-crud-table';
import { Row } from '../../ng-data-table';
import { ColumnBase } from '../../ng-data-table/base';
import { SipTableServerSourceService } from '../services/sip-table-server-source.service';
import { SipTableDataSource } from './sip-table-data-source';
import { SipTableSettings } from './sip-table-settings';

export class SipTableServerManager extends DataManager {


    constructor(public injector: Injector, columns: ColumnBase[],
        settings: SipTableSettings, source?: SipTableDataSource) {
        super(columns, settings, source || new SipTableServerSourceService(injector, settings));

        if (settings) {
            settings.clientSide = false;

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
    }

    public get datas(): any[] {
        let rows:Row[];
        return !rows ? [] : rows.map(item=>item.$$data);
    }
    public set datas(value: any[]) {
        this.rows = value;
    }

    public get dataSource(): SipTableDataSource {
        return this.service;
    }

    public set dataSource(value: SipTableDataSource) {
        this.service = value;
    }

    refresh() {
        this.getItems().then();
    }

    search(searchparams?: object) {
        this.dataSource.searchparams = searchparams;
        this.refresh();
    }

    /**
     * 根据属性值，获取row
     * @param propName 
     * @param value 
     * @example getRow('id', '1111');
     */
    getRow(propName: string, value: any): Row {
        return this.getRows().find((item) => { return item.$$data[propName] == value; });
    }

    getSelectedRows(): Row[] {
        let rows = this.selection.getSelectedRows(this.getRows()) || [];
        return Lib.isArray(rows) ? rows : [rows];
    }

    getSelectedFirstRow(): Row {
        let rows = this.getSelectedRows();
        return rows && rows.length > 0 ? rows[0] : null;
    }

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

}
