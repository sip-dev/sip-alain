import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
    selector: 'header-user',
    template: `
    <nz-dropdown nzPlacement="bottomRight">
        <div class="item d-flex align-items-center px-sm" nz-dropdown>
            <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
            {{settings.user.name}}
            <i class="anticon anticon-down ml-sm"></i>
        </div>
        <div nz-menu class="width-sm">
            <div nz-menu-item ><i class="anticon anticon-user mr-sm"></i>个人中心</div>
            <div nz-menu-item ><i class="anticon anticon-appstore-o mr-sm"></i>配置管理</div>
            <div nz-menu-item ><i class="anticon anticon-profile mr-sm"></i>操作日志</div>
            <li nz-menu-divider></li>
            <div nz-menu-item>
                <header-fullscreen></header-fullscreen>
            </div>
            <div nz-menu-item>
                <header-storage></header-storage>
            </div>
            <div nz-menu-item (click)="logout()"><i class="anticon anticon-logout mr-sm"></i>退出登录</div>
        </div>
    </nz-dropdown>
    `,
})
export class HeaderUserComponent {
    constructor(
        public settings: SettingsService,
        private router: Router,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) { }

    logout() {
        this.tokenService.clear();
        this.router.navigateByUrl(this.tokenService.login_url);
    }
}
