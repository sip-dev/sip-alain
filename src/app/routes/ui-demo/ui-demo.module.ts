import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AlertComponent } from './alert/alert.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { PromptComponent } from './prompt/prompt.component';
import { ListCreateComponent } from './list-create/list-create.component';
import { ListDetailComponent } from './list-detail/list-detail.component';
import { ListFormComponent } from './list-form/list-form.component';
import { ServerListComponent } from './server-list/server-list.component';
import { UiDemoRoutingModule } from './ui-demo-routing.module';
import { UiDemoSharedModule } from './ui-demo-shared/ui-demo-shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        UiDemoSharedModule,
        UiDemoRoutingModule
    ],
    declarations: [
        ListCreateComponent,
        ListDetailComponent,
		ListFormComponent,
        ServerListComponent,
        AlertComponent,
        ConfirmComponent,
        PromptComponent
    ],
    providers: [],
    exports:[
        UiDemoSharedModule,
        ListCreateComponent,
        ListDetailComponent,
		ListFormComponent,
        ServerListComponent,
        UiDemoRoutingModule,
        AlertComponent,
        ConfirmComponent,
        PromptComponent
    ],
    entryComponents:[
        ListFormComponent,
        AlertComponent,
        ConfirmComponent,
        PromptComponent
    ]
})
export class UiDemoModule { }
