import {
    Component, Input, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy
  } from '@angular/core';
import {Column, DataTable} from '../../base';
import {Subscription} from 'rxjs';
import {ColumnMenuEventArgs} from '../../types';

  @Component({
    selector: 'app-datatable-header-cell',
    templateUrl: 'header-cell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
  })

  export class HeaderCellComponent implements OnInit, OnDestroy {

    @Input() public table: DataTable;

    @Input() set column(column: Column) {
        this._column = column;
        this.cellContext.column = column;
    }

    get column(): Column {
        return this._column;
    }

    @HostBinding('class')
    get columnCssClasses(): any {
      return 'datatable-header-cell';
    }

    @HostBinding('style.width.px')
    get width(): number {
      return this.column.width;
    }

    @HostBinding('attr.title')
    get name(): string {
      return this.column.title;
    }

    public cellContext: any = {
        column: this.column,
    };
    private _column: Column;
    private subscriptions: Subscription[] = [];

    constructor(public cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        const subFilter = this.table.events.filterSource$.subscribe(() => {
          this.cd.markForCheck();
        });
        this.subscriptions.push(subFilter);
      }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    onSort(column: Column) {
        if (!column.sortable) {
          return;
        }
        this.table.sorter.setOrder(column.name);
        this.table.events.onSort();
    }

    clickColumnMenu(event: any, column: Column, isLast: boolean) {
        const el = event.target.parentNode;
        let left = el.offsetLeft;
        let top = el.offsetTop;
        top = top + this.table.dimensions.headerRowHeight;
        // datatable-row-left + offsetLeft
        if (el.parentNode.offsetLeft > 0) {
          left = left + el.parentNode.offsetLeft - this.table.dimensions.offsetX;
        }
        const width = this.table.dimensions.columnMenuWidth;
        if ((event.pageX + 1 + width - document.body.scrollLeft > window.innerWidth) || isLast) {
          left = left + column.width - width;
        }
        this.table.events.onColumnMenuClick(<ColumnMenuEventArgs>{left, top, column});
    }

  }
