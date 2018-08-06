import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataTableModule } from '../ng-data-table/data-table-module';
import { TreeTableComponent } from './components/tree-table/tree-table.component';


@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
  ],
  declarations: [
    TreeTableComponent,
  ],
  exports: [
    TreeTableComponent,
  ],
  providers: []
})
export class TreeTableModule {
}
