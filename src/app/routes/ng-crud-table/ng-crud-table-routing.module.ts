import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { RowGroupComponent } from './row-group/row-group.component';

const routes: Routes = [
    {
        path: 'data-table',
        component: DataTableComponent
    },
    {
        path: 'row-group',
        component: RowGroupComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgCrudTableRoutingModule { }
