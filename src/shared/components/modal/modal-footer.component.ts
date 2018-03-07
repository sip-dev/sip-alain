import { Component, ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'sip-modal-footer',
  template: `<ng-template #content><div><ng-content></ng-content></div></ng-template>`,
  styles: []
})
export class ModalFooterComponent {

  @ViewChild('content') content: TemplateRef<any>;

}
