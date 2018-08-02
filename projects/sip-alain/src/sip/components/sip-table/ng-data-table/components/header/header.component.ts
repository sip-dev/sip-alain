import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants, DataTable } from '../../base';
import { translate } from '../../base/util';

@Component({
  selector: 'app-datatable-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HeaderComponent implements OnInit, OnDestroy {

  @Input() public table: DataTable;

  @HostBinding('class') cssClass = 'datatable-header';
  @ViewChild('headerTemplate', { read: ViewContainerRef }) headerTemplate: ViewContainerRef;

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (this.table.settings.columnResizeMode === Constants.resizeAminated) {
      const subColumnResize = this.table.events.resizeSource$.subscribe(() => {
        this.cd.markForCheck();
      });
      this.subscriptions.push(subColumnResize);
    }
    const subColumnResizeEnd = this.table.events.resizeEndSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subScroll = this.table.events.scrollSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    if (this.headerTemplate) {
      this.headerTemplate.clear();
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  stylesByGroup() {
    return translate(this.table.dimensions.offsetX * -1, 0);
  }

}
