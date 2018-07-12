import { Component, ViewContainerRef } from '@angular/core';
import { Column, DataSource } from '@shared/components/ng-crud-table';
import { SipTableManager, SipTableSettings } from '@shared/components/sip-table';
import { SipNgInit, SipPage, SipProvidePages } from 'sip-alain';
import { getColumnsPlayers } from '../shareds/column';

@Component({
  selector: 'sip-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.less'],
  providers: [...SipProvidePages(CrudTableComponent)]
})
export class CrudTableComponent extends SipPage {

  constructor(private vcf: ViewContainerRef) {
    super(vcf);
    this.columns = getColumnsPlayers();
    // for (const column of this.columns) {
    //   column.editable = false;
    // }
    // this.service = new SipDataTableService(vcf.injector, 10);
    // this.dataManager = new DataManager(this.columns, this.serverSideSettings, this.service);
    this.dataManager = new SipTableManager(vcf.injector, this.columns, this.serverSideSettings);
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
  public dataManager: SipTableManager;

  public serverSideSettings: SipTableSettings = new SipTableSettings({
    sqlId: 'iaas.instlist', connstr: 'iaas',
    sortName: 'name', sortOrder: 'asc',
    pageSize: 10,
    contextmenuAction: (e, row) => {
      return {
        width:'100px',
        items: [{
          title: 'test',
          onClick: (p) => {
            console.log('test',row);
          }
        },
        {
          title: 'test1',
          onClick: (p) => {
            console.log('test1', row);
          }
        }]
      };
    }
  });


}
