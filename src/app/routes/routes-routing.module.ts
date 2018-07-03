import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';

const routes: Routes = [
    {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      { path: '', redirectTo: 'ui-demo/list', pathMatch: 'full' },
      {
        path: 'ui-demo',
        loadChildren: './ui-demo/ui-demo.module#UiDemoModule'
      },
      {
          path: 'ng-crud-table',
          loadChildren: './ng-crud-table/ng-crud-table.module#NgCrudTableModule'
      }
    ]
  },
    // 全屏布局
    {
    path: 'data-v',
    component: LayoutFullScreenComponent,
    children: [
      { path: '', redirectTo: 'ng-alain/data-v', pathMatch: 'full' }
    ]
  },
    // passport
    {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        redirectTo: 'ng-alain/register', pathMatch: 'full'
      },
      {
        path: 'register',
        redirectTo: 'ng-alain/register', pathMatch: 'full'
      },
      {
        path: 'register-result',
        redirectTo: 'ng-alain/register-result', pathMatch: 'full',

      },
    ]
  },
    // 单页不包裹Layout
    {
    path: 'callback/:type',
    redirectTo: 'ng-alain/callback/:type', pathMatch: 'full'
  },
    {
    path: 'lock', redirectTo: 'ng-alain/lock', pathMatch: 'full',
  },
    {
    path: '403',
    redirectTo: 'ng-alain/403', pathMatch: 'full'
  },
    {
    path: '404',
    redirectTo: 'ng-alain/404', pathMatch: 'full'
  },
    {
    path: '500',
    redirectTo: 'ng-alain/500', pathMatch: 'full'
  },
    {
    path: 'ng-alain',
    loadChildren: './ng-alain/ng-alain.module#NgAlainModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
