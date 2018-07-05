import { Component, ViewContainerRef } from '@angular/core';
import { SipNgInit, SipPage, SipProvidePages } from 'sip-alain';

@Component({
  selector: 'sip-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.less'],
  providers: [...SipProvidePages(TreeTableComponent)]
})
export class TreeTableComponent extends SipPage {

  constructor(vcf: ViewContainerRef) {
    super(vcf);
  }

  params = { id: '' };

  /**等效于ngOnInit, 但可以多次使用 */
  @SipNgInit()
  private _init() {
    this.params = this.$params(this.params);
    console.log('init', this.params);
  }

}
