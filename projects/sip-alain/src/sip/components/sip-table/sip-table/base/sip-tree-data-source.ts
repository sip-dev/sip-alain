import { TreeDataSource, TreeNode } from '../../ng-tree-table';

export abstract class SipTreeDataSource implements TreeDataSource {
    abstract url: string;
    abstract getNodes(node?: TreeNode): Promise<TreeNode[]>;
    abstract searchNodes(name: string): Promise<any>;
}

