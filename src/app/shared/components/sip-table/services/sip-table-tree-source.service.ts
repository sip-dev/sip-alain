import { Injectable, Injector } from '@angular/core';
import { TreeNode } from '@shared/components/ng-data-table';
import { SipRestService } from 'sip-alain';
import { SipTableSettings } from '../base/sip-table-settings';
import { SipTreeDataSource } from '../base/sip-tree-data-source';

@Injectable({
  providedIn: 'root'
})
export class SipTableTreeSourceService extends SipTreeDataSource {

  public url: string = 'api/demo/data-table/tree';

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
    this.treeDatas = settings.treeDatas;
    this.childrenFiled = settings.treeChildrenField;
  }

  private getChildrenDatas(datas: any[], parentId?: string) {
    return datas.filter((item) => {
      return !parentId ? !item[this.parentIdField] : item[this.parentIdField] == parentId;
    });
  }

  private checkLeaf(data: any): boolean {
    if (this.childrenFiled) {
      let children = data[this.childrenFiled];
      return !(children && children.length > 0);
    }
    return data[this.leafField];
  }

  private makeTreeNodeItem(data: any, children: any[], allDatas?: any[]): TreeNode {
    if (!data) return null;
    let idField = this.idField;
    let nameField = this.nameField;
    return <TreeNode>{
      id: data ? data[idField] : '',
      name: data ? data[nameField] : '',
      leaf: data ? this.checkLeaf(data) : true,
      data: data || {},
      children: this.makeTreeNodes(children, allDatas),
      expanded: false,
      icon: ''
    };
  }

  makeTreeNodes(datas: any[], allDatas?: any[]): TreeNode[] {
    if (!datas) return null;
    allDatas || (allDatas = datas);
    if (this.childrenFiled) {
      return datas.map((item) => {
        return this.makeTreeNodeItem(item, item[this.childrenFiled], allDatas);
      });
    } else {
      return datas.map((item) => {
        let children = item[this.parentIdField] ?
          this.getChildrenDatas(allDatas || datas, item[this.idField]) : [];
        return this.makeTreeNodeItem(item, children, allDatas);
      });
    }
  }

  getNodes(node: TreeNode): Promise<TreeNode[]> {
    let treeDatas = this.treeDatas;
    if (treeDatas) {
      return new Promise((resolve) => {
        resolve(this.makeTreeNodes(this.getChildrenDatas(treeDatas, node ? node.id : ''), treeDatas));
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
