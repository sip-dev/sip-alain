import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { UserRegisterComponent } from './passport/register/register.component';

const routes: Routes = [
    {
        path: 'callback/:type',
        component: CallbackComponent
    },
    {
        path: 'data-v',
        loadChildren: './data-v/data-v-routing.module#DataVRoutingModule'
    },
    {
        path: '403',
        component: Exception403Component
    },
    {
        path: '404',
        component: Exception404Component
    },
    {
        path: '500',
        component: Exception500Component
    },
    {
        path: 'lock',
        component: UserLockComponent,
        data: { title: '锁屏', titleI18n: 'lock' }
    },
    {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '登录', titleI18n: 'pro-login' }
    },
    {
        path: 'register',
        component: UserRegisterComponent,
        data: { title: '注册', titleI18n: 'pro-register' }
    },
    {
        path: 'register-result',
        component: UserRegisterResultComponent,
        data: { title: '注册结果', titleI18n: 'pro-register-result' }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgAlainRoutingModule { }
