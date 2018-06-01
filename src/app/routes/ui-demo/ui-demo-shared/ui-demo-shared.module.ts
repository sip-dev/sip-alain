import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FormComponent } from './components/form/form.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        FormComponent
    ],
    providers: [],
    exports:[
        FormComponent
    ],
    entryComponents:[]
})
export class UiDemoSharedModule { }
