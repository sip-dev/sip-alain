import { Component, TemplateRef, ViewContainerRef } from '@angular/core';
import { SipModal, SipNgInit, SipProvideModals } from '../../help/sip-helper';

@Component({
  selector: 'sip-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.less'],
  providers: [...SipProvideModals(AlertComponent)]
})
export class AlertComponent extends SipModal {

  constructor(vcf: ViewContainerRef) {
    super(vcf);
  }

  content: string;
  contentTmpl: TemplateRef<any>

  titleText: string;
  titleTextTmpl: TemplateRef<any>

  @SipNgInit()
  private _init() {
    let params = this.$params({ content: null, title: null });
    if (params.content instanceof TemplateRef)
      this.contentTmpl = params.content;
    else
      this.content = params.content;
    if (params.title instanceof TemplateRef)
      this.titleTextTmpl = params.title;
    else
      this.titleText = params.title || '提示框';
  }

  save() {
    this.$close(true);
  }
}
