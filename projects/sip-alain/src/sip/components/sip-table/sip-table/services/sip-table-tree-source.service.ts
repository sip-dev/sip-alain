import { Injectable, Injector } from '@angular/core';
import { SipRestService, SipSqlParam } from '../../../../services/sip-rest.service';
import { TreeNode } from '../../ng-tree-table/base/interface';
import { SipTableSettings } from '../base/sip-table-settings';
import { SipTreeDataSource } from '../base/sip-tree-data-source';

@Injectable({
  providedIn: 'root'
})
export class SipTableTreeSourceService extends SipTreeDataSource {

  public url: string;
  // onSetRows: EventEmitter<TreeNode[]> = new EventEmitter<TreeNode[]>();

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

  public makeTreeNodes(datas: any[]): TreeNode[] {
    if (!datas) return [];
    let treeNodes = datas.map((data) => {
      let node: TreeNode = this.makeTreeNodeItem(data);
      return node;
    });

    return treeNodes;
  }

  private makeTreeNodeItem(data): TreeNode {
    let node: TreeNode = {
      id: data ? data[this.idField] : '',
      name: data ? data[this.nameField] : '',
      leaf: data ? data[this.leafField] : true,
      data: data || {},
      expanded: false,
      icon: ''
    };
    let children = this.getChildrenNodes(data, node.id);
    if (children && children.length > 0)
      node.children = children;
    return node;
  }

  private getChildrenNodes(data, parentId): TreeNode[] {
    let children: any[];
    if (this.childrenFiled) {
      children = data[this.childrenFiled] || [];
    } else {
      let datas = this.treeDatas;
      children = datas.filter((item) => {
        return !parentId ? !item[this.parentIdField] : item[this.parentIdField] == parentId;
      });
    }
    return this.makeTreeNodes(children);
  }

  getNodes(node: TreeNode): Promise<TreeNode[]> {
    // console.log('get node', node);
    let treeDatas = this.treeDatas;
    if (treeDatas) {
      return new Promise((resolve) => {
        let data = {};
        if (this.childrenFiled)
          data[this.childrenFiled] = treeDatas;
        let treeNodes: TreeNode[] = this.getChildrenNodes(data, '');
        // console.log('treeNodes', treeNodes);
        resolve(treeNodes);
      });
    } else {
      let param: SipSqlParam = <SipSqlParam>this.settings;
      let searchparams = this.searchparams || {};
      param.searchparam = searchparams;
      let restSrv = this.settings.restSrv;
      return (restSrv ? restSrv(param) : this.http.sqlList(param))
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

  public get searchparams(): object {
    return this.settings.searchparam;
  }

  public set searchparams(value: object) {
    this.settings.searchparam = value;
  }

}
