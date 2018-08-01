import { Component, ViewContainerRef } from '@angular/core';
import { SipTableColumn, SipTableDataManager, SipTableSettings } from '@shared/components/sip-table';
import { SipNgInit, SipPage, SipProvidePages } from 'sip-alain';
import { getColumnsPlayers } from '../shared/base/column';

@Component({
  selector: 'sip-row-group',
  templateUrl: './row-group.component.html',
  styleUrls: ['./row-group.component.less'],
  providers: [...SipProvidePages(RowGroupComponent)]
})
export class RowGroupComponent extends SipPage {

  constructor(vcf: ViewContainerRef) {
    super(vcf);
  }

  public tableManager: SipTableDataManager;
  public columns: SipTableColumn[];

  public settings: SipTableSettings = new SipTableSettings({
    groupRowsBy: ['race']
  });

  //等效于ngOnInit, 但可以多次使用
  @SipNgInit()
  private _init() {
    this.columns = getColumnsPlayers();
    this.tableManager = new SipTableDataManager(this.$injector(), this.columns, this.settings);
    this.tableManager.events.onLoading(true);
    this.tableManager.pager.perPage = 50;
    this.$httpSrv.get('api/demo/data-table/players').subscribe(rs => {
      this.tableManager.rows = rs.datas;
      this.tableManager.events.onLoading(false);
    });
  }

}
