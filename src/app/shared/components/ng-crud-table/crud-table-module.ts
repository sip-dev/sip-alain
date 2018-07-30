import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '../ng-data-table';
import { CrudTableComponent } from './components/crud-table/crud-table.component';
import { CalendarComponent } from './components/form/calendar.component';
import { CheckboxComponent } from './components/form/checkbox.component';
import { FormComponent } from './components/form/form.component';
import { InputOptionComponent } from './components/form/input-option.component';
import { InputTextComponent } from './components/form/input-text.component';
import { InputComponent } from './components/form/input.component';
import { RadioComponent } from './components/form/radio.component';
import { PopupSelectComponent } from './components/form/select-popup.component';
import { SelectComponent } from './components/form/select.component';
import { TextareaComponent } from './components/form/textarea.component';
import { ModalEditFormComponent } from './components/modal-edit-form/modal-edit-form.component';
import { ModalSelectComponent } from './components/modal-select/modal-select.component';
import { ModalComponent } from './components/modal/modal.component';
import { RowMenuComponent } from './components/row-menu/row-menu.component';
import { RowViewComponent } from './components/row-view/row-view.component';
import { OrderPipe } from './pipes/order.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    DataTableModule,
  ],
  declarations: [
    CrudTableComponent,
    ModalComponent,
    OrderPipe,
    FormComponent,
    ModalEditFormComponent,
    InputComponent,
    InputOptionComponent,
    SelectComponent,
    CheckboxComponent,
    RadioComponent,
    InputTextComponent,
    TextareaComponent,
    CalendarComponent,
    ModalSelectComponent,
    PopupSelectComponent,
    RowViewComponent,
    RowMenuComponent,
  ],
  exports: [
    CrudTableComponent,
    ModalComponent,
    ModalEditFormComponent,
  ],
  providers: []
})
export class CrudTableModule {
}
