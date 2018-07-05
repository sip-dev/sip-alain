import { Column, DataTable, Message, Settings } from "@shared/components/ng-crud-table";
import { Row } from "@shared/components/ng-data-table";

export class SipDataTable extends DataTable {
    constructor(columns: Column[], settings: Settings, messages?: Message) {
        super(columns, settings, messages);
        if (settings){
            this._isEditMode = settings.editMode === 'editProgrammatically';
            this.events.pageSource$.subscribe((p)=>{
                this.cancleAllEditCell();
            });
            if (settings.contextMenu) {
                // this.
                this.events.contextMenuSource$.subscribe((p) => {
                    let e: MouseEvent = p.event;
                    e.stopPropagation();
                    e.preventDefault();
                });
            }
        }
    }

    getSelectedRows(): Row[] {
        return this.dataSelection.getSelectedRows(this.getRows()) || [];
    }

    getSelectedFirstRow(): Row {
        let rows = this.getSelectedRows();
        return rows && rows.length > 0 ? rows[0] : null;
    }

    private _isEditMode:boolean;
    private _isEditing: boolean;
    public get isEditing(): boolean {
        return this._isEditing;
    }
    editCell(rowIndex: number, columnIndex: number, editMode: boolean) {
        if (this._isEditMode && editMode){
            this._isEditing = true;
        }
        super.editCell(rowIndex, columnIndex, editMode);
    }

    cancleAllEditCell(){
        if (!this._isEditing) return false;
        this._isEditing = false;
        let rows = this.getRows();
        let cols = this.columns;
        let rowCount = rows ? rows.length : 0;
        let colCount = cols ? cols.length : 0;
        if (rowCount == 0 || colCount == 0) return;
        for (let rowIndex = rowCount-1;rowIndex>-1;rowIndex--){
            for(let colIndex = colCount-1;colIndex>-1;colIndex--){
                this.editCell(rowIndex, colIndex, false);
            }
        }
    }
}
