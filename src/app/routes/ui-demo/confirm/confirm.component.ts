import { Component, ViewContainerRef } from '@angular/core';
import { SipModal, SipNgDestroy, SipNgInit, SipProvideModals } from 'sip-alain';

@Component({
  selector: 'sip-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.less'],
  providers: [...SipProvideModals(ConfirmComponent)]
})
export class  ConfirmComponent  extends SipModal {

  constructor(vcf: ViewContainerRef) {
    super(vcf);
  }

  @SipNgInit()
  private _init() {
    let params = this.$params({ id: 0 });
    this.$logger.debug('init ConfirmComponent', params);
  }

  @SipNgDestroy()
  private _destroy() {
    this.$logger.debug('destroy ConfirmComponent');
  }

  save(){
    this.$close(true);
  }
}
