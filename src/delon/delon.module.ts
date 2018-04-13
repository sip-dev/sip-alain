/**
 * 进一步对基础模块的导入提炼
 * 有关模块注册指导原则请参考：https://github.com/cipchk/ng-alain/issues/180
 */
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonAuthModule } from '@delon/auth';
import { DelonCacheModule } from '@delon/cache';
import { AlainThemeModule } from '@delon/theme';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
    imports: [
        NgZorroAntdModule.forRoot(),
        AlainThemeModule.forRoot(),
        DelonABCModule.forRoot(),
        DelonAuthModule.forRoot(),
        DelonACLModule.forRoot(),
        DelonCacheModule.forRoot()
    ]
})
export class DelonModule {
    constructor(@Optional() @SkipSelf() parentModule: DelonModule) {
        throwIfAlreadyLoaded(parentModule, 'DelonModule');
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DelonModule,
            providers: []
        };
    }
}
