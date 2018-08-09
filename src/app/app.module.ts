// angular i18n
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@env/environment';
import { NgxTinymceModule } from 'ngx-tinymce';
// third
import { UEditorModule } from 'ngx-ueditor';
import { SipAlainConfig, SipAlainModule } from 'sip-alain';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SipConfigService } from './core/sip/services/sip-config.service';
import { LayoutModule } from './layout/layout.module';
import { RoutesModule } from './routes/routes.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SipAlainModule,
    CoreModule,
    SharedModule,
    LayoutModule,
    RoutesModule,
		...environment.MOCKMODULE,
    // thirds
    UEditorModule.forRoot({
      // **注：** 建议使用本地路径；以下为了减少 ng-alain 脚手架的包体大小引用了CDN，可能会有部分功能受影响
      js: [
        `//apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.config.js`,
        `//apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.all.min.js`
      ],
      options: {
        UEDITOR_HOME_URL: `//apps.bdimg.com/libs/ueditor/1.4.3.1/`
      }
    }),
    NgxTinymceModule.forRoot({
      baseURL: '//cdn.bootcss.com/tinymce/4.7.4/'
    })
  ],
  providers: [
    { provide: SipAlainConfig, useClass: SipConfigService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
