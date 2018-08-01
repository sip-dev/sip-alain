import { Component, ViewContainerRef } from '@angular/core';
import { Column } from '@shared/components/ng-crud-table';
import { SipTableDataManager } from '@shared/components/sip-table';
import { SipAccess, SipAccessItem, SipAccessManager, SipInject, SipNgDestroy, SipNgInit, SipPage, SipProvidePages } from 'sip-alain';
import { SipTableSettings } from '../../../shared/components/sip-table/base/sip-table-settings';
import { ListFormComponent } from '../../ui-demo/list-form/list-form.component';
import { getColumnsPlayers } from '../shared/base/column';
import { PlayerService } from '../shared/services/player.service';
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
    this.tableManager = new SipTableDataManager(vcf.injector, this.columns, this.settings);
  }

  params = { id: '' };

  @SipAccess<DataTableComponent>()
  accessManager: SipAccessManager;

  @SipInject(PlayerService)
  private _playerSrv:PlayerService;

  //等效于ngOnInit, 但可以多次使用
  @SipNgInit()
  private _init() {
    this.params = this.$params(this.params);
    this.tableManager.events.onLoading(true);
    this._playerSrv.getList().subscribe(rs => {
      this.tableManager.rows = rs.datas;
      this.tableManager.events.onLoading(false);
    });
    this.tableManager.events.selectionSource$.subscribe(() => {
      var rows = this.tableManager.selection.getSelectedRows(this.tableManager.getRows());
      this.$access.check(rows);
    });
    console.log('init', this.params);
  }

  @SipNgDestroy()
  private _destroy() {
    console.log('_destroy test in list');
  }

  public tableManager: SipTableDataManager;
  public columns: Column[];

  public settings: SipTableSettings = new SipTableSettings({
    clientSide: true,
    columnResizeMode: 'aminated',
    selectionType: 'multiple',
    selectionMode: 'checkbox',
    contextMenu: true,
    editMode: 'editProgrammatically'
  });

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
    let rows = this.tableManager.getSelectedRows();
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
      this.editText = this.tableManager.isEditing ? '保存' : '编辑';
      return true;
    }
  })
  edit() {

    let isEditing = !this.tableManager.isEditing;
    if (isEditing){
      this.tableManager.getSelectedRows().forEach((row) => {
        for (let colIndex = 0; colIndex < 6; colIndex++)
          this.tableManager.editCell(row.$$index, colIndex, isEditing);
      });
    } else {
      this.tableManager.unEditCellAll();
    }
    this.editText = this.tableManager.isEditing ? '保存' : '编辑';
  }

}