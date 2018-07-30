import {
  Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef
} from '@angular/core';
import {TreeNode} from '../../types';
import {TreeTable, Constants} from '../../base';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['../../styles/index.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TreeTableComponent implements OnInit, OnDestroy {

  @Input() public treeTable: TreeTable;
  @Output() requestNodes: EventEmitter<TreeNode> = new EventEmitter();

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.treeTable.initGetNodes();
    this.treeTable.dimensions.actionColumnWidth = 250;
    this.treeTable.settings.columnResizeMode = Constants.resizeAminated;

    const subScroll = this.treeTable.events.scrollSource$.subscribe((event) => {
      requestAnimationFrame(() => {
        this.cd.detectChanges();
      });
    });
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onRequestNodes(event) {
    this.requestNodes.emit(event);
  }

}
