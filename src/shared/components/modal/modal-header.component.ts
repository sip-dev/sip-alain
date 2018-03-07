import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'sip-modal-header',
  template: `<ng-template #content><ng-content></ng-content></ng-template>`,
  styles: []
})
export class ModalHeaderComponent {

	@ViewChild('content') content: TemplateRef<any>;

}
