import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FormComponent } from './components/form/form.component';
import { UserService } from './services/user.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        FormComponent
    ],
    providers: [
        UserService
    ],
    exports:[
        FormComponent
    ],
    entryComponents:[]
})
export class UiDemoSharedModule { }
