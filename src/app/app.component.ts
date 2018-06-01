import { Component, HostBinding, OnInit, ViewContainerRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SettingsService, TitleService } from '@delon/theme';
import { filter } from 'rxjs/operators';
import { SipAppContainerService } from 'sip-alain';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  @HostBinding('class.layout-fixed')
  get isFixed() {
    return this.settings.layout.fixed;
  }
  @HostBinding('class.layout-boxed')
  get isBoxed() {
    return this.settings.layout.boxed;
  }
  @HostBinding('class.aside-collapsed')
  get isCollapsed() {
    return this.settings.layout.collapsed;
  }

  constructor(
    private settings: SettingsService,
    private router: Router,
    private titleSrv: TitleService,
    contain: SipAppContainerService,
    vcRef: ViewContainerRef
  ) { contain.init(vcRef); }

  ngOnInit() {
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => this.titleSrv.setTitle());
  }
}
