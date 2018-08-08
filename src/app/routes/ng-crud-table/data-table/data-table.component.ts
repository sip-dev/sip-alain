import { Component, ViewContainerRef } from '@angular/core';
import { SipAccess, SipAccessItem, SipAccessManager, SipInject, SipNgDestroy, SipNgInit, SipPage, SipProvidePages, SipTableColumn, SipTableDataManager, SipTableSettings } from 'sip-alain';
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
  }

  params = { id: '' };

  @SipAccess<DataTableComponent>()
  accessManager: SipAccessManager;

  @SipInject(PlayerService)
  private _playerSrv: PlayerService;

  //等效于ngOnInit, 但可以多次使用
  @SipNgInit()
  private _init() {
    this.params = this.$params(this.params);
    this.columns = getColumnsPlayers();
    this.tableManager = new SipTableDataManager(this.$injector(), this.columns, this.settings);
    this.tableManager.events.onLoading(true);
    this._playerSrv.getList().subscribe(rs => {
      this.tableManager.datas = rs.datas;
      this.tableManager.events.onLoading(false);
    });
    this.tableManager.events.selectionSource$.subscribe(() => {
      var datas = this.tableManager.getSelectedDatas();
      this.$access.check(datas);
    });
    this.tableManager.events.activateCellSource$.subscribe((p) => {
      console.log('activateCellSource', p);
    });
    this.tableManager.events.clickCellSource$.subscribe((p) => {
      console.log('cell click', p);
    });
    console.log('init - 1', this.params);
  }

  @SipNgDestroy()
  private _destroy() {
    console.log('_destroy test in list');
  }

  public tableManager: SipTableDataManager;
  public columns: SipTableColumn[];

  public settings: SipTableSettings = new SipTableSettings({
    clientSide: true,
    columnResizeMode: 'aminated',
    selectionMultiple: true,
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

  @SipAccessItem('test', {
    multi: false, hasData: true,
    check: function (datas: any[], target: any) {
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
    if (isEditing) {
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