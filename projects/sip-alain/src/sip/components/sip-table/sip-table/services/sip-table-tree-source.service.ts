import { EventEmitter, Injectable, Injector } from '@angular/core';
import { Lib } from 'sip-lib';
import { SipRestService } from '../../../../services/sip-rest.service';
import { TreeNode } from '../../ng-data-table/types/interface';
import { SipTableSettings } from '../base/sip-table-settings';
import { SipTreeDataSource } from '../base/sip-tree-data-source';

@Injectable({
  providedIn: 'root'
})
export class SipTableTreeSourceService extends SipTreeDataSource {

  public url: string;
  onSetRows: EventEmitter<TreeNode[]> = new EventEmitter<TreeNode[]>();

  http: SipRestService;
  private settings: SipTableSettings;
  private idField: string;
  private leafField: string;
  private nameField: string;
  private parentIdField: string;
  private childrenFiled: string;
  private treeDatas: any[];

  constructor(private injector: Injector, settings: SipTableSettings) {
    super();
    this.http = this.injector.get(SipRestService);
    this.settings = Object.assign(settings);
    this.url = settings.api;
    this.idField = settings.treeIdField || 'id';
    this.nameField = settings.treeNameField || 'name';
    this.leafField = settings.treeLeafField || 'leaf';
    this.parentIdField = settings.treeParentIdField || 'parentId';
    this.treeDatas = settings.treeDatas || [];
    this.childrenFiled = settings.treeChildrenField;
  }

  private getChildrenDatas(node?: TreeNode): any[] {
    if (this.childrenFiled) {
      return node ? (node.data[this.childrenFiled] || []) : this.treeDatas;
    } else {
      let datas = this.treeDatas;
      let parentId = node ? node.id : '';
      return datas.filter((item) => {
        return !parentId ? !item[this.parentIdField] : item[this.parentIdField] == parentId;
      });
    }
  }

  private hasChild(data): boolean {
    if (this.childrenFiled) {
      return (data[this.childrenFiled] || []).lenght > 0;
    } else {
      let has = false;
      let datas = this.treeDatas;
      let parentId = data[this.idField];
      Lib.each(datas, (item) => {
        has = !parentId ? !item[this.parentIdField] : item[this.parentIdField] == parentId;
        return !has;
      });
      return has;
    }
  }

  private checkLeaf(data: any): boolean {
    if (this.leafField in data)
      return data[this.leafField];
    else if (this.childrenFiled) {
      let children = data[this.childrenFiled];
      return !(children && children.length > 0);
    } else
      return !this.hasChild(data);
  }

  private makeTreeNodeItem(data: any): TreeNode {
    if (!data) return null;
    let idField = this.idField;
    let nameField = this.nameField;
    return <TreeNode>{
      id: data ? data[idField] : '',
      name: data ? data[nameField] : '',
      leaf: data ? this.checkLeaf(data) : true,
      data: data || {},
      expanded: false,
      icon: ''
    };
  }

  makeTreeNodes(datas: any[]): TreeNode[] {
    if (!datas) return [];
    return datas.map((item) => {
      return this.makeTreeNodeItem(item);
    });
  }

  getNodes(node: TreeNode): Promise<TreeNode[]> {
    // console.log('get node', node);
    let treeDatas = this.treeDatas;
    if (treeDatas) {
      return new Promise((resolve) => {
        let treeNodes: TreeNode[] = this.makeTreeNodes(this.getChildrenDatas(node));
        resolve(treeNodes);
      });
    } else {
      return this.http.sqlList(this.settings)
        .toPromise()
        .then((rs) => {
          const datas: any[] = rs.datas || [];
          return this.makeTreeNodes(datas);
        });
    }

  }

  searchNodes(name: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 500);
    });
  }
}
