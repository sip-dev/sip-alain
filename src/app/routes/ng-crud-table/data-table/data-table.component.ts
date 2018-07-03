import { Component, ViewContainerRef } from '@angular/core';
import { Column, DataTable, Settings } from '@shared/components/ng-crud-table';
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
    this.table = new DataTable(this.columns, this.settings);
  }

  params = { id: '' };

  @SipAccess<DataTableComponent>()
  accessManager: SipAccessManager;

  //等效于ngOnInit, 但可以多次使用
  @SipNgInit()
  private _init() {
    this.params = this.$params(this.params);
    this.table.events.onLoading(true);
    this.$httpSrv.get('assets/tmp/players.json').subscribe(rs => {
      this.table.rows = rs.datas;
      this.table.events.onLoading(false);
    });
    this.table.events.selectionSource$.subscribe(() => {
      var rows = this.table.dataSelection.getSelectedRows(this.table.getRows());
      this.$access.check(rows);
    });
    console.log('init', this.params);
  }

  @SipNgDestroy()
  private _destroy() {
    console.log('_destroy test in list');
  }

  public table: DataTable;
  public columns: Column[];

  public settings: Settings = <Settings>{
    clientSide: true,
    columnResizeMode: 'aminated',
    selectionType: 'multiple',
    selectionMode: 'checkbox'
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
    this.$modal(ListFormComponent, { id: '' }).subscribe(r => {
      if (!r) return;
      console.log('ListFormComponent', r);
    });
  }

  editText = '编辑';
  @SipAccessItem<DataTableComponent>('edit', {
    multi: true, hasData: true,
    check: function () {
      return true;
    }
  })
  edit() {
  }

}