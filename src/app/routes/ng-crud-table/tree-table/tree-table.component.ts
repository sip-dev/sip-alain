import { Component, ViewContainerRef } from '@angular/core';
import { Column } from '@shared/components/ng-data-table';
import { SipTableSettings, SipTableTreeManager } from '@shared/components/sip-table';
import { SipNgInit, SipPage, SipProvidePages } from 'sip-alain';

@Component({
  selector: 'sip-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.less'],
  providers: [...SipProvidePages(TreeTableComponent)]
})
export class TreeTableComponent extends SipPage {

  constructor(vcf: ViewContainerRef) {
    super(vcf);
    this.tableManager = new SipTableTreeManager(vcf.injector, this.columns, new SipTableSettings({
      /**id字段, 默认为id */
      treeIdField: 'id',
      /**name字段，默认为name */
      treeNameField: 'name',
      /**叶子字段，值为false表示有子节点（不是叶子） */
      treeLeafField: 'leaf',
      /**ParentId字段，默认为parentId */
      treeParentIdField: 'parentId',
      /**children字段, 默认为空，如果有内容表示子节点数据 */
      // treeChildrenField:'children',
      treeDatas: [
        {
          id: 'MALE',
          name: 'MALE',
          data: { column: 'gender' }
        },
        {
          id: 'FEMALE',
          name: 'FEMALE',
          data: { column: 'gender' }
        },
        {
          id: 'FEMALE_1',
          parentId: 'MALE',
          name: 'FEMALE_1',
          data: { column: 'gender_1' }
        },
        {
          id: 'FEMALE_1_1',
          parentId: 'FEMALE_1',
          name: 'FEMALE_1_1',
          data: { column: 'gender_1_1' }
        },
        {
          id: 'FEMALE_a',
          parentId: 'FEMALE',
          name: 'FEMALE_a',
          data: { column: 'gender_a' }
        }]
    }));

    this.tableManagerChild = new SipTableTreeManager(vcf.injector, this.columns, new SipTableSettings({
      /**id字段, 默认为id */
      treeIdField: 'id',
      /**name字段，默认为name */
      treeNameField: 'name',
      /**children字段, 默认为空，如果有内容表示子节点数据 */
      treeChildrenField: 'children',
      treeDatas: [
        {
          id: 'MALE',
          name: 'MALE',
          data: { column: 'gender' },
          children: [{
            id: 'FEMALE_1',
            name: 'FEMALE_1',
            data: { column: 'gender_1' },
            children: [{
              id: 'FEMALE_1_1',
              name: 'FEMALE_1_1',
              data: { column: 'gender_1_1' }
            }]
          }]
        },
        {
          id: 'FEMALE',
          name: 'FEMALE',
          data: { column: 'gender' },
          children: [{
            id: 'FEMALE_a',
            name: 'FEMALE_a',
            data: { column: 'gender_a' }
          }]
        }
      ]
    }));
  }

  params = { id: '' };

  /**等效于ngOnInit, 但可以多次使用 */
  @SipNgInit()
  private _init() {
    this.params = this.$params(this.params);
    console.log('init', this.params);
    this.tableManager.events.selectionSource$.subscribe(()=>{
      console.log('selecha', this.tableManager.selectedNode.data);
    });
  }
  tableManager: SipTableTreeManager;
  tableManagerChild: SipTableTreeManager;
  tableManagerHttp: SipTableTreeManager;

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
    console.log('onEditComplete', event);
  }
}
