import { Component, ViewContainerRef } from '@angular/core';
import { Column, DataTable, Settings } from '@shared/components/ng-crud-table';
import { SipNgDestroy, SipNgInit, SipPage, SipProvidePages } from 'sip-alain';
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

  //等效于ngOnInit, 但可以多次使用
  @SipNgInit()
  private _init() {
    this.params = this.$params(this.params);
    this.table.events.onLoading(true);
    this.$httpSrv.get('assets/tmp/players.json').subscribe(rs => {
      this.table.rows = rs.datas;
      this.table.events.onLoading(false);
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
  };

}