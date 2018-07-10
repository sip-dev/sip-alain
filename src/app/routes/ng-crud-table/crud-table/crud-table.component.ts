import { Component, ViewContainerRef } from '@angular/core';
import { Column, DataManager, DataSource, Settings } from '@shared/components/ng-crud-table';
import { SipNgInit, SipPage, SipProvidePages } from 'sip-alain';
import { getColumnsPlayers } from '../shareds/column';
import { SipDataTableService } from '../shareds/services/sip-data-table.service';

@Component({
  selector: 'sip-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.less'],
  providers: [...SipProvidePages(CrudTableComponent)]
})
export class CrudTableComponent extends SipPage {

  constructor(vcf: ViewContainerRef) {
    super(vcf);
    this.columns = getColumnsPlayers();
    // for (const column of this.columns) {
    //   column.editable = false;
    // }
    this.service = new SipDataTableService(vcf.injector, 10);
    this.dataManager = new DataManager(this.columns, this.serverSideSettings, this.service);
  }

  params = { id: '' };

  /**等效于ngOnInit, 但可以多次使用 */
  @SipNgInit()
  private _init() {
    this.params = this.$params(this.params);
    console.log('init', this.params);
  }

  public service: DataSource;
  public columns: Column[];
  public dataManager: DataManager;

  public serverSideSettings: Settings = <Settings>{
    api: 'api/demo/data-table/players',
    globalFilter: true
  };


}
