import { Component, ViewContainerRef } from '@angular/core';
import { Column, DataTable, Settings } from '@shared/components/ng-data-table';
import { SipTableSettings, SipTableTreeManager } from '@shared/components/sip-table';
import { SipNgInit, SipPage, SipProvidePages } from 'sip-alain';
import { TreeDataSourceService } from '../shareds/services/tree-data-source.service';

@Component({
  selector: 'sip-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.less'],
  providers: [...SipProvidePages(TreeTableComponent)]
})
export class TreeTableComponent extends SipPage {

  constructor(vcf: ViewContainerRef) {
    super(vcf);
    this.treeService = new TreeDataSourceService(vcf.injector);
    this.table = new DataTable(this.columns, this.settings);
    this.manager = new SipTableTreeManager(vcf.injector, this.columns, new SipTableSettings({
      treeDatas:[
        {
          id: 'MALE',
          name: 'MALE',
          data: { column: 'gender' },
          leaf:false
        },
        {
          id: 'FEMALE',
          name: 'FEMALE',
          data: { column: 'gender' },
        },
        {
          id: 'FEMALE_1',
          parentId:'MALE',
          name: 'FEMALE_1',
          data: { column: 'gender_1' },
        }]
    }));
  }

  manager:SipTableTreeManager;

  params = { id: '' };

  /**等效于ngOnInit, 但可以多次使用 */
  @SipNgInit()
  private _init() {
    this.params = this.$params(this.params);
    console.log('init', this.params);
    setTimeout(()=>{
      this.table.rows = [];
    }, 2000);
  }

  
  public treeService: TreeDataSourceService;
  public table: DataTable;
  public settings: Settings;
  public columns: Column[] = <Column[]>[
    {
      title: 'Column',
      name: 'column',
      sortable: false,
      filter: false,
      frozen: false,
      resizeable: true,
      editable: true,
      width: 250,
    },
    {
      title: 'Cube_size',
      name: 'cube_size',
      sortable: false,
      filter: false,
      frozen: false,
      resizeable: true,
      editable: true,
      width: 250,
    },
    {
      title: 'Exp',
      name: 'exp',
      sortable: false,
      filter: false,
      frozen: false,
      resizeable: true,
      editable: true,
      width: 250,
    }
  ];

  onEditComplete(event) {
    console.log(event);
  }
}
