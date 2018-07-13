import { Component, ViewContainerRef } from '@angular/core';
import { Column, Settings } from '@shared/components/ng-crud-table';
import { SipTableDataManager } from '@shared/components/sip-table';
import { SipAccess, SipAccessItem, SipAccessManager, SipNgDestroy, SipNgInit, SipPage, SipProvidePages } from 'sip-alain';
import { ListFormComponent } from '../../ui-demo/list-form/list-form.component';
import { getColumnsPlayers } from '../shareds/column';
@Component({
  selector: 'sip-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.less'],
  providers: [...SipProvidePages(DataTableComponent)]
})
export class DataTableComponent extends SipPage {

  constructor(vcf: ViewContainerRef) {
    super(vcf);
    this.columns = getColumnsPlayers();
    this.manager = new SipTableDataManager(vcf.injector, this.columns, this.settings);
  }

  params = { id: '' };

  @SipAccess<DataTableComponent>()
  accessManager: SipAccessManager;

  //等效于ngOnInit, 但可以多次使用
  @SipNgInit()
  private _init() {
    this.params = this.$params(this.params);
    this.manager.events.onLoading(true);
    this.$httpSrv.get('api/demo/data-table/players').subscribe(rs => {
      this.manager.rows = rs.datas;
      this.manager.events.onLoading(false);
    });
    this.manager.events.selectionSource$.subscribe(() => {
      var rows = this.manager.selection.getSelectedRows(this.manager.getRows());
      this.$access.check(rows);
    });
    console.log('init', this.params);
  }

  @SipNgDestroy()
  private _destroy() {
    console.log('_destroy test in list');
  }

  public manager: SipTableDataManager;
  public columns: Column[];

  public settings: Settings = <Settings>{
    clientSide: true,
    columnResizeMode: 'aminated',
    selectionType: 'multiple',
    selectionMode: 'checkbox',
    contextMenu: true,
    editMode: 'editProgrammatically'
  };

  @SipAccessItem<DataTableComponent>('create', {
    multi: false, hasData: false,
    check: function () {
      return true;
    }
  })
  create() {
    let url = 'ui-demo/list-create';
    this.$navigate(url, { id: '' }).subscribe(r => {
      if (!r) return;
      console.log(url, r);
    });
  }

  @SipAccessItem<DataTableComponent>('test', {
    multi: false, hasData: true,
    check: function () {
      return true;
    }
  })
  test() {
    let rows = this.manager.getSelectedRows();
    console.log('rows', rows);
    this.$modal(ListFormComponent, { id: '' }).subscribe(r => {
      if (!r) return;
      console.log('ListFormComponent', r);
    });
  }

  editText = '编辑';
  @SipAccessItem<DataTableComponent>('edit', {
    multi: true, hasData: true,
    check: function () {
      this.editText = this.manager.isEditing ? '保存' : '编辑';
      return true;
    }
  })
  edit() {

    let isEditing = !this.manager.isEditing;
    if (isEditing){
      this.manager.getSelectedRows().forEach((row) => {
        for (let colIndex = 0; colIndex < 6; colIndex++)
          this.manager.editCell(row.$$index, colIndex, isEditing);
      });
    } else {
      this.manager.unEditCellAll();
    }
    this.editText = this.manager.isEditing ? '保存' : '编辑';
  }

}