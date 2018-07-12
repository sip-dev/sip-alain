import { Injector } from '@angular/core';
import { DataManager } from '../../ng-crud-table';
import { Row } from '../../ng-data-table';
import { ColumnBase } from '../../ng-data-table/base';
import { SipDataSourceService } from '../services/sip-data-source.service';
import { SipTableDataSource } from './sip-table-data-source';
import { SipTableSettings } from './sip-table-settings';

export class SipTableManager extends DataManager {

    constructor(private injector: Injector, columns: ColumnBase[],
        settings: SipTableSettings, dataSource?: SipTableDataSource) {
        super(columns, settings, dataSource ? dataSource : new SipDataSourceService(injector, settings));

        let sortName = settings.sortName;
        if (sortName) {
            let sortOrder = settings.sortOrder == 'asc' ? 1 : -1;
            this.sorter.sortMeta.push({field:sortName, order:sortOrder});
        }

        if (settings) {
            this._isEditMode = settings.editMode === 'editProgrammatically';
            if (this._isEditMode) {
                /**翻页时取消所有cell编辑状态 */
                this.events.pageSource$.subscribe((p) => {
                    this.unEditCellAll();
                });
            }
            if (settings.contextmenuAction) {
                let contextmenu = settings.contextmenuAction;
                this.events.contextMenuSource$.subscribe((e) => {
                    return contextmenu.show(e.event, e);
                });
            }
        }
    }

    public get dataSource(): SipTableDataSource {
        return this.service;
    }

    public set dataSource(value: SipTableDataSource) {
        this.service = value;
    }

    refresh(){
        this.getItems().then();
    }

    search(searchparams?:object){
        this.dataSource.searchparams = searchparams;
        this.refresh();
    }

    getSelectedRows(): Row[] {
        return this.selection.getSelectedRows(this.getRows()) || [];
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
