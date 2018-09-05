import { Component, ViewContainerRef } from '@angular/core';
import { SipModal, SipNgDestroy, SipNgInit, SipProvideModals } from 'sip-alain';

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

  @SipNgInit()
  private _init() {
    let params = this.$params({ id: 0 });
    this.$logger.debug('init PromptComponent', params);
  }

  @SipNgDestroy()
  private _destroy() {
    this.$logger.debug('destroy PromptComponent');
  }

  save(){
    this.$close(true);
  }
}
