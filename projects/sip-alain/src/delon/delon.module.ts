/**
 * 进一步对基础模块的导入提炼
 * 有关模块注册指导原则请参考：https://github.com/cipchk/ng-alain/issues/180
 */
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { DelonABCModule, ReuseTabService, ReuseTabStrategy } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonAuthModule } from '@delon/auth';
import { DelonCacheModule } from '@delon/cache';
import { AlainThemeModule } from '@delon/theme';
import { DelonUtilModule } from '@delon/util';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
    imports: [
        NgZorroAntdModule.forRoot(),
        AlainThemeModule.forRoot(),
        DelonABCModule.forRoot(),
        DelonAuthModule.forRoot(),
        DelonACLModule.forRoot(),
        DelonCacheModule.forRoot(),
        DelonUtilModule.forRoot()
    ]
})
export class DelonModule {
    constructor(@Optional() @SkipSelf() parentModule: DelonModule) {
        throwIfAlreadyLoaded(parentModule, 'DelonModule');
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DelonModule,
            providers: [
                // TIPS：若不需要路由复用需要移除以下代码及模板`<reuse-tab></reuse-tab>`
                {
                    provide: RouteReuseStrategy,
                    useClass: ReuseTabStrategy,
                    deps: [ReuseTabService],
                }//,
                // TIPS：@delon/abc 有大量的全局配置信息，例如设置所有 `simple-table` 的页码默认为 `20` 行
                // { provide: SimpleTableConfig, useFactory: simpleTableConfig }
                // { provide: AdPageHeaderConfig, useFactory: pageHeaderConfig },
                // { provide: DelonAuthConfig, useFactory: delonAuthConfig },
            ],
        };
    }
}
