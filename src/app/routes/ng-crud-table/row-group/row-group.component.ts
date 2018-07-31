import { Component, ViewContainerRef } from '@angular/core';
import { Column, Settings } from '@shared/components/ng-crud-table';
import { SipTableDataManager } from '@shared/components/sip-table';
import { SipNgInit, SipPage, SipProvidePages } from 'sip-alain';
import { getColumnsPlayers } from '../shareds/column';

@Component({
  selector: 'sip-row-group',
  templateUrl: './row-group.component.html',
  styleUrls: ['./row-group.component.less'],
  providers: [...SipProvidePages(RowGroupComponent)]
})
export class RowGroupComponent extends SipPage {

  constructor(vcf: ViewContainerRef) {
    super(vcf);
    this.columns = getColumnsPlayers();
    this.tableManager = new SipTableDataManager(vcf.injector, this.columns, this.settings);
  }

  public tableManager: SipTableDataManager;
  public columns: Column[];

  public settings: Settings = <Settings>{
    groupRowsBy: ['race']
  };

  //等效于ngOnInit, 但可以多次使用
  @SipNgInit()
  private _init() {
    this.tableManager.events.onLoading(true);
    this.tableManager.pager.perPage = 50;
    this.$httpSrv.get('api/demo/data-table/players').subscribe(rs => {
      this.tableManager.rows = rs.datas;
      this.tableManager.events.onLoading(false);
    });
  }

}
