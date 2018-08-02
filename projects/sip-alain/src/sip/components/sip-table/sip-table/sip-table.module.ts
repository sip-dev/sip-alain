import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CrudTableModule } from '../ng-crud-table/crud-table-module';
import { DataTableModule } from '../ng-data-table/data-table-module';
import { SipTableComponent } from './components/sip-table/sip-table.component';

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    CrudTableModule
  ],
  declarations: [
    SipTableComponent
  ],
  exports: [
    DataTableModule,
    CrudTableModule,
    SipTableComponent
  ]
})
export class SipTableModule { }
