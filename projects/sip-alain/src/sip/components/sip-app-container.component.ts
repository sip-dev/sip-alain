import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SipAppContainerService } from '../services/sip-app-container.service';

@Component({
  selector: 'sip-app-container',
  template: `<ng-template #contextmenu let-left="left" let-top="top" let-mousedown="mousedown" let-click="click" let-menu="menu"><div class="sip-contextmenu"
    [style.left]="left" [style.top]="top" (mousedown)="mousedown($event)" (click)="click($event)">
  <ng-content *ngIf="!menu" ></ng-content>
  <sip-menu *ngIf="menu" [width]="menu.width" [datas]="menu.items"></sip-menu>
  </div></ng-template>`,
  styles: [`.sip-contextmenu {position: absolute;z-index:10000;}`]
})
export class SipAppContainerComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    let destroy = this._contain.onDestroy;
    destroy.emit();
    destroy.unsubscribe();
    destroy.complete();
  }

  @ViewChild('contextmenu') contextmenu: TemplateRef<any>;

  constructor(private _contain: SipAppContainerService,
    private _vcRef: ViewContainerRef) {
  }

  ngOnInit() {
    this._contain._init(this._vcRef, this.contextmenu);
  }
}
