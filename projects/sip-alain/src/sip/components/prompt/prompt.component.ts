import { Component, TemplateRef, ViewContainerRef } from '@angular/core';
import { SipModal, SipNgInit, SipProvideModals } from '../../help/sip-helper';

@Component({
  selector: 'sip-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.less'],
  providers: [...SipProvideModals(PromptComponent)]
})
export class PromptComponent extends SipModal {

  constructor(vcf: ViewContainerRef) {
    super(vcf);
  }

  content: string;
  contentTmpl: TemplateRef<any>

  titleText: string;
  titleTextTmpl: TemplateRef<any>

  value:string;
  textarea:boolean;

  @SipNgInit()
  private _init() {
    let params = this.$params({ content: null, title: null, p:null });
    if (params.content instanceof TemplateRef)
      this.contentTmpl = params.content;
    else
      this.content = params.content;
    if (params.title instanceof TemplateRef)
      this.titleTextTmpl = params.title;
    else
      this.titleText = params.title || '输入框';
    let p:{ value: any; textarea: boolean } = params.p;
    this.value =  p && p.value;
    this.textarea = p && p.textarea;
  }

  save(){
    this.$close(this.value);
  }
}
