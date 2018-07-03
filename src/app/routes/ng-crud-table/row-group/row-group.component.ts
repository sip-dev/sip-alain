import { Component, ViewContainerRef } from '@angular/core';
import { Column, DataTable, Settings } from '@shared/components/ng-crud-table';
import { SipNgInit, SipPage, SipProvidePages } from 'sip-alain';
import { getColumnsPlayers } from '../shareds/column';

@Component({
  selector: 'app-row-group',
  templateUrl: './row-group.component.html',
  styleUrls: ['./row-group.component.less'],
  providers: [...SipProvidePages(RowGroupComponent)]
})
export class RowGroupComponent extends SipPage {

  constructor(vcf: ViewContainerRef) {
    super(vcf);
    this.columns = getColumnsPlayers();
    this.table = new DataTable(this.columns, this.settings);
  }

  public table: DataTable;
  public columns: Column[];

  public settings: Settings = <Settings>{
    groupRowsBy: ['race']
  };

  //等效于ngOnInit, 但可以多次使用
  @SipNgInit()
  private _init() {
    this.table.events.onLoading(true);
    this.table.pager.perPage = 50;
    this.$httpSrv.get('assets/tmp/players.json').subscribe(rs => {
      this.table.rows = rs.datas;
      this.table.events.onLoading(false);
    });
  }
}
