import { Component, TemplateRef, ViewContainerRef } from '@angular/core';
import { SipModal, SipNgInit, SipProvideModals } from '../../help/sip-helper';

@Component({
  selector: 'sip-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.less'],
  providers: [...SipProvideModals(ConfirmComponent)]
})
export class ConfirmComponent extends SipModal {

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
      this.titleText = params.title || '确认框';
  }

  save() {
    this.$close(true);
  }
}
