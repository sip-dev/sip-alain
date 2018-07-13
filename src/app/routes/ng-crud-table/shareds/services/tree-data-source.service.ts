import { Injectable, Injector } from '@angular/core';
import { TreeDataSource, TreeNode } from '@shared/components/ng-data-table';
import { SipRestService } from 'sip-alain';

@Injectable({
  providedIn: 'root'
})
export class TreeDataSourceService implements TreeDataSource {

  public url: string = 'api/demo/data-table/tree';

  http: SipRestService;

  constructor(private injector: Injector) {
    this.http = this.injector.get(SipRestService);
  }

  getNodes(node: TreeNode): Promise<TreeNode[]> {
    if (node) {
      const children: TreeNode[] = [
        {
          id: 'MALE',
          name: 'MALE',
          data: { column: 'gender' },
          leaf: false,
        },
        {
          id: 'FEMALE',
          name: 'FEMALE',
          data: { column: 'gender' },
        }];
      if (node.$$level) {
        children[0].id = 'MALE' + node.$$level;
        children[0].name = 'MALE' + node.$$level;
        children[0].leaf = (node.$$level === 10);
        children[1].id = 'FEMALE' + node.$$level;
        children[1].name = 'FEMALE' + node.$$level;
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve(children), 500);
      });
    } else {
      return this.http.get(this.url)
        .toPromise()
        .then(function (rs) {
          return <TreeNode[]>rs.datas;
        });
    }
  }

  searchNodes(name: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(['ELYOS', 'MALE', 'LAZY']), 500);
    });
  }
}
