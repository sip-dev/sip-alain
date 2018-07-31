import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UiDemoModule } from '../ui-demo/ui-demo.module';
import { DataTableComponent } from './data-table/data-table.component';
import { NgCrudTableRoutingModule } from './ng-crud-table-routing.module';
import { RowGroupComponent } from './row-group/row-group.component';
import { TreeTableComponent } from './tree-table/tree-table.component';
import { ServerTableComponent } from './server-table/server-table.component';
import { CurdTableSharedModule } from './shared/curd-table-shared.module';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        UiDemoModule,
        NgCrudTableRoutingModule,
        CurdTableSharedModule
    ],
    declarations: [
        DataTableComponent,
        RowGroupComponent,
        TreeTableComponent,
        ServerTableComponent
    ],
    exports: [
        DataTableComponent,
        RowGroupComponent,
        TreeTableComponent,
        ServerTableComponent,
        CurdTableSharedModule
    ]
})
export class NgCrudTableModule { }
