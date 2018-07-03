import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DataTableComponent } from './data-table/data-table.component';
import { NgCrudTableRoutingModule } from './ng-crud-table-routing.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgCrudTableRoutingModule
  ],
  declarations: [
        DataTableComponent
    ],
    exports: [
        DataTableComponent
    ]
})
export class NgCrudTableModule { }
