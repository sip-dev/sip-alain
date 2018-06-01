import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// delon
import { AlainThemeModule } from '@delon/theme';
// i18n
import { TranslateModule } from '@ngx-translate/core';
// third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        AlainThemeModule.forChild(),
        DelonABCModule,
        DelonACLModule,
        DelonFormModule,
        // third libs
        NgZorroAntdModule
    ],
    declarations: [
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AlainThemeModule,
        DelonABCModule,
        DelonACLModule,
        // i18n
        TranslateModule,
        // third libs
        NgZorroAntdModule
    ]
})
export class DelonSharedModule { }
