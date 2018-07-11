import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CrudTableModule } from '../ng-crud-table';
import { DataTableModule } from '../ng-data-table';
import { SipTableComponent } from './components/sip-table/sip-table.component';

@NgModule({
  imports: [
    CommonModule,
    CrudTableModule,
    DataTableModule
  ],
  declarations: [
    SipTableComponent
  ],
  exports: [
    CrudTableModule,
    DataTableModule,
    SipTableComponent
  ]
})
export class SipTableModule { }
