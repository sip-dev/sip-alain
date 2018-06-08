import { Component, ViewContainerRef } from '@angular/core';
import { SipAppContainerService } from '../../core/services/sip-app-container.service';

@Component({
  selector: 'sip-app-container',
  template: ''
})
export class SipAppContainerComponent {

  constructor(contain: SipAppContainerService,
    vcRef: ViewContainerRef) {
    contain.init(vcRef);
  }

}
