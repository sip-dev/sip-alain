import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[sipShow]'
})
export class ShowDirective {

  @HostBinding('style.display') get display() { return this.sipShow ? '' : 'none'; }

  @Input() sipShow = true;
  
  constructor() { }

}
