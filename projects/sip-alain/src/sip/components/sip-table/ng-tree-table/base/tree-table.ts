import { Injector } from '@angular/core';
import { ColumnBase } from '../../ng-data-table/base/column-base';
import { Message } from '../../ng-data-table/base/message';
import { Settings } from '../../ng-data-table/base/settings';
import { SipDataTable } from '../../sip-table/base/sip-data-table';
import { Row } from './index';
import { Tree } from './tree';
import { TreeFlattener } from './tree-flattener';
import { TreeNode } from './tree-node';
import { TreeDataSource } from './tree-types';

export class TreeTable<T=object> extends SipDataTable<T> {

  set service(val: TreeDataSource) {
    this.tree.service = val;
  }

  get service(): TreeDataSource {
    return this.tree.service;
  }

  set nodes(val: TreeNode[]) {
    this.tree.nodes = val;
    this.flatten();
  }

  get nodes(): TreeNode[] {
    return this.tree.nodes;
  }

  set serverSideFiltering(val: boolean) {
    this.tree.serverSideFiltering = val;
  }

  get filterLoading(): boolean {
    return this.tree.filterLoading;
  }

  tree: Tree;
  treeFlattener: TreeFlattener;

  constructor(columns: ColumnBase[], settings: Settings, dataSource: TreeDataSource, messages?: Message, injector?:Injector) {
    super(columns, settings, messages, injector);
    this.tree = new Tree();
    this.tree.service = dataSource;
    this.treeFlattener = new TreeFlattener(this.transformer);
  }

  transformer = (node: TreeNode, level: number) => {
    const data = {
      expandable: !!node.expanded,
      level: level,
      node: node,
    };
    return Object.assign(data, node.data);
  }

  flatten() {
    this.rows = this.treeFlattener.flattenNodes(this.nodes);
    this.events.onRowsChanged();
  }

  getDescendants(row: Row) {
    const results = [];
    for (let i = row.$$index + 1; i < this.rows.length && row.level < this.rows[i].level; i++) {
      results.push(this.rows[i]);
    }
    return results;
  }

  rowsToTree(rows: any[], from: string, to: string): TreeNode[] {
    const map = {};
    const roots: TreeNode[] = [];

    for (let i = 0; i < rows.length; i++) {
      const id = rows[i][to];
      map[id] = <TreeNode>{
        id: id,
        name: (rows[i].name) ? rows[i].name : null,
        data: Object.assign({}, rows[i]),
        icon: (rows[i].icon) ? rows[i].icon : null,
        children: [],
      };
    }

    for (let i = 0; i < rows.length; i++) {
      const id = rows[i][to];
      const node = map[id];
      const parentId = node.data[from];
      if (parentId !== 0) {
        map[parentId].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

}
