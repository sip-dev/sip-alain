import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UiDemoModule } from '../ui-demo/ui-demo.module';
import { DataTableComponent } from './data-table/data-table.component';
import { NgCrudTableRoutingModule } from './ng-crud-table-routing.module';
import { RowGroupComponent } from './row-group/row-group.component';
import { TreeTableComponent } from './tree-table/tree-table.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        UiDemoModule,
        NgCrudTableRoutingModule
    ],
    declarations: [
        DataTableComponent,
        RowGroupComponent,
        TreeTableComponent
    ],
    exports: [
        DataTableComponent,
        RowGroupComponent,
        TreeTableComponent
    ]
})
export class NgCrudTableModule { }
