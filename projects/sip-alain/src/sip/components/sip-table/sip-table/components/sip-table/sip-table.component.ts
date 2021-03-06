import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SipTableDataManager } from '../../base/sip-table-data-manager';
import { SipTableServerManager } from '../../base/sip-table-server-manager';
import { SipTableTreeManager } from '../../base/sip-table-tree-manager';

@Component({
  selector: 'sip-table',
  templateUrl: './sip-table.component.html',
  styleUrls: ['./sip-table.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class SipTableComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  dataManager: SipTableDataManager;
  serverManager: SipTableServerManager;

  treeMananger: SipTableTreeManager;

  private _manager: any;
  @Input()
  public get manager(): any {
    return this._manager;
  }
  public set manager(value: any) {
    this._manager = value;
    this.serverManager = this.dataManager = this.treeMananger = null;
    if (value instanceof SipTableDataManager) {
      this.dataManager = value;
    } else if (value instanceof SipTableServerManager) {
      this.serverManager = value;
    } else if (value instanceof SipTableTreeManager) {
      this.treeMananger = value;
    }
  }

}
