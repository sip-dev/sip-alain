import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { AlainACLModule } from '@delon/acl';
import { ZORROMODULES, ABCMODULES } from './delon.module';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// region: your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [];
// endregion

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        ...ZORROMODULES,
        AlainThemeModule.forChild(),
        ...ABCMODULES,
        AlainACLModule
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ...ZORROMODULES,
        AlainThemeModule,
        ...ABCMODULES,
        // i18n
        TranslateModule,
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ]
})
export class DelonSharedModule { }
