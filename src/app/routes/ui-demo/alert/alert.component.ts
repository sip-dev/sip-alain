import { Component, ViewContainerRef } from '@angular/core';
import { SipModal, SipNgDestroy, SipNgInit, SipProvideModals } from 'sip-alain';

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

  @SipNgInit()
  private _init() {
    let params = this.$params({ id: 0 });
    this.$logger.debug('init AlertComponent', params);
  }

  @SipNgDestroy()
  private _destroy() {
    this.$logger.debug('destroy AlertComponent');
  }

  save(){
    this.$close(true);
  }
}
