import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { UiDemoSharedModule } from './ui-demo-shared/ui-demo-shared.module';
import { ListComponent } from './list/list.component';
import { ListCreateComponent } from './list-create/list-create.component';
import { ListDetailComponent } from './list-detail/list-detail.component';
import { ListFormComponent } from './list-form/list-form.component';
import { ServerListComponent } from './server-list/server-list.component';
import { UiDemoRoutingModule } from './ui-demo-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        UiDemoSharedModule,
        UiDemoRoutingModule
    ],
    declarations: [
        ListComponent,
        ListCreateComponent,
        ListDetailComponent,
		ListFormComponent,
        ServerListComponent
    ],
    providers: [],
    exports:[
        UiDemoSharedModule,
        ListComponent,
        ListCreateComponent,
        ListDetailComponent,
		ListFormComponent,
        ServerListComponent,
        UiDemoRoutingModule
    ],
    entryComponents:[
        ListFormComponent
    ]
})
export class UiDemoModule { }
