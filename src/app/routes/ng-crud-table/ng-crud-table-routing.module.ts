import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { RowGroupComponent } from './row-group/row-group.component';
import { TreeTableComponent } from './tree-table/tree-table.component';
import { ServerTableComponent } from './server-table/server-table.component';

const routes: Routes = [
    {
        path: 'data-table',
        component: DataTableComponent
    },
    {
        path: 'row-group',
        component: RowGroupComponent
    },
    {
        path: 'tree-table',
        component: TreeTableComponent
    },
    {
        path: 'server-table',
        component: ServerTableComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgCrudTableRoutingModule { }
