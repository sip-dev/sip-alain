import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Column, DataFilter, DataTable } from '../../base';

@Component({
  selector: 'app-string-filter',
  templateUrl: 'string-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() table: DataTable;
  @Input() column: Column;
  @Input() isOpen: boolean;
  @Output() filterClose: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('filterInput') filterInput: any;

  filterTimeout: any;
  matchMode: string = DataFilter.CONTAINS;
  stringOperators: any[];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.stringOperators = [
      {value: DataFilter.EQUALS, text: this.table.messages.equals},
      {value: DataFilter.NOT_EQUAL, text: this.table.messages.notEqual},
      {value: DataFilter.STARTS_WITH, text: this.table.messages.startsWith},
      {value: DataFilter.ENDS_WITH, text: this.table.messages.endsWith},
      {value: DataFilter.CONTAINS, text: this.table.messages.contains},
      {value: DataFilter.NOT_CONTAINS, text: this.table.messages.notContains}
    ];
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFocus();
    this.matchMode = this.table.dataFilter.getFilterMatchMode(this.column.name) || this.matchMode;
  }

  onFilterInput(event) {
    const value = event.target.value;
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filter(value);
      this.filterTimeout = null;
    }, this.table.settings.filterDelay);
  }

  filter(value) {
    this.table.dataFilter.setFilter(value, this.column.name, this.matchMode);
    this.table.events.onFilter();
    this.cd.markForCheck();
  }

  uncheckAll() {
    this.filter(null);
    this.filterClose.emit(true);
  }

  setFocus() {
    if (this.filterInput) {
      setTimeout(() => {
        this.filterInput.nativeElement.focus();
      }, 1);
    }
  }

  onModeChange() {
    const val = this.filterInput.nativeElement.value;
    if (val) {
      this.filter(val);
    }
  }

}
