import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SipTableManager } from '../../base';

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

  @Input() dataManager:SipTableManager;

}
