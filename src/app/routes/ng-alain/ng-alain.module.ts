import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { NgAlainRoutingModule } from './ng-alain-routing.module';
import { UserLockComponent } from './passport/lock/lock.component';
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { UserRegisterComponent } from './passport/register/register.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgAlainRoutingModule
    ],
    declarations: [
        CallbackComponent,
        Exception403Component,
        Exception404Component,
        Exception500Component,
        UserLockComponent,
        UserLoginComponent,
        UserRegisterComponent,
        UserRegisterResultComponent
    ],
    exports: [
        NgAlainRoutingModule,
        CallbackComponent,
        Exception500Component,
        Exception500Component,
        Exception500Component,
        UserLockComponent,
        UserLoginComponent,
        UserRegisterComponent,
        UserRegisterResultComponent
    ]
})
export class NgAlainModule { }
