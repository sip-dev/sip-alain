import {
  Component, OnInit, ViewChild, Input, Output, ViewEncapsulation, EventEmitter, ElementRef, HostBinding,
  ChangeDetectionStrategy, DoCheck, KeyValueDiffers, KeyValueDiffer, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import {DataTable, Constants} from '../../base';
import {Subscription} from 'rxjs';
import {BodyScrollDirective} from '../../directives/body-scroll.directive';

@Component({
  selector: 'app-datatable',
  templateUrl: './data-table.component.html',
  styleUrls: ['../../styles/index.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent implements OnInit, DoCheck, OnDestroy {

  @Input() public table: DataTable;
  @Output() editComplete: EventEmitter<any> = new EventEmitter();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('resizeHelper') resizeHelper: ElementRef;
  @ViewChild('footer') footerViewChild: ElementRef;
  @ViewChild(BodyScrollDirective) bodyScroll: BodyScrollDirective;

  @HostBinding('class') cssClass = 'datatable';

  @HostBinding('class.scroll-vertical')
  get isVirtualScroll(): boolean {
    return this.table.settings.virtualScroll;
  }

  @HostBinding('style.width.px')
  get tableWidth() {
    return this.table.dimensions.tableWidth;
  }

  public loading: boolean;
  private rowDiffer: KeyValueDiffer<{}, {}>;
  private subscriptions: Subscription[] = [];

  constructor(private element: ElementRef, private differs: KeyValueDiffers, private cd: ChangeDetectorRef) {
    this.rowDiffer = this.differs.find({}).create();
  }

  ngOnInit() {
    const subSelection = this.table.events.selectionSource$.subscribe(() => {
      this.onSelectedRow();
    });
    const subFilter = this.table.events.filterSource$.subscribe(() => {
      this.onFilter();
    });
    const subSort = this.table.events.sortSource$.subscribe(() => {
      this.onSort();
    });
    const subEdit = this.table.events.editSource$.subscribe((row) => {
      this.onEditComplete(row);
    });
    const subColumnBeginResize = this.table.events.resizeBeginSource$.subscribe(() => {
      this.onColumnResizeBegin();
    });
    const subColumnResize = this.table.events.resizeSource$.subscribe((event) => {
      this.onColumnResize(event);
    });
    const subColumnResizeEnd = this.table.events.resizeEndSource$.subscribe(() => {
      this.onColumnResizeEnd();
    });
    const subScroll = this.table.events.scrollSource$.subscribe(() => {
      requestAnimationFrame(() => {
        this.cd.detectChanges();
      });
    });
    const subLoading = this.table.events.loadingSource$.subscribe((event) => {
      this.loading = event;
    });
    this.subscriptions.push(subSelection);
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subEdit);
    this.subscriptions.push(subColumnBeginResize);
    this.subscriptions.push(subColumnResize);
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subScroll);
    this.subscriptions.push(subLoading);
  }

  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.table.rows)) {
      this.cd.markForCheck();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onPageChanged(page: number): void {
    this.table.pager.current = page;
    this.table.events.onPage();
    if (this.table.settings.virtualScroll) {
      const rowIndex = this.table.pager.perPage * (page - 1);
      const offset = rowIndex * this.table.dimensions.rowHeight;
      this.bodyScroll.setOffsetY(offset);
    } else {
      if (this.table.settings.clientSide) {
        this.table.getLocalRows();
      }
    }
    this.table.selection.clearSelection();
  }

  onEditComplete(event) {
    this.editComplete.emit(event);
  }

  onFilter() {
    this.table.pager.current = 1;
    if (this.table.settings.clientSide) {
      this.table.getLocalRows();
    }
    if (this.table.settings.virtualScroll && !this.table.settings.clientSide) {
      this.bodyScroll.setOffsetY(0);
    }
    this.table.chunkRows(true);
    this.table.selection.clearSelection();
  }

  onSort() {
    if (this.table.settings.clientSide) {
      this.table.getLocalRows();
    }
    if (this.table.settings.virtualScroll && !this.table.settings.clientSide) {
      this.bodyScroll.setOffsetY(0);
    }
    this.table.chunkRows(true);
    this.table.selection.clearSelection();
  }

  onSelectedRow() {
    this.selectionChange.emit(this.table.selection.getSelection());
  }

  onColumnResizeBegin() {
    this.element.nativeElement.classList.add('datatable-unselectable');
    const height = this.element.nativeElement.offsetHeight - this.footerViewChild.nativeElement.offsetHeight;
    this.resizeHelper.nativeElement.style.height = height + 'px';
  }

  onColumnResize(event) {
    if (this.table.settings.columnResizeMode === Constants.resizeSimple) {
      const rect = this.element.nativeElement.getBoundingClientRect();
      const containerLeft = rect.left + document.body.scrollLeft;
      this.resizeHelper.nativeElement.style.left = (event.pageX - containerLeft + this.element.nativeElement.scrollLeft) + 'px';
      this.resizeHelper.nativeElement.style.display = 'block';
    }
  }

  onColumnResizeEnd() {
    this.resizeHelper.nativeElement.style.display = 'none';
    this.element.nativeElement.classList.remove('datatable-unselectable');
    this.table.dimensions.calcColumnsTotalWidth(this.table.columns);
  }

}
