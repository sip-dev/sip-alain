export class Message {

  empty?: string;
  loading?: string;
  clearFilters?: string;
  create?: string;
  delete?: string;
  save?: string;
  close?: string;
  titleCreate?: string;
  titleUpdate?: string;
  titleDetailView?: string;
  search?: string;
  selectAll?: string;
  clear?: string;
  equals?: string;
  notEqual?: string;
  lessThan?: string;
  lessThanOrEqual?: string;
  greaterThan?: string;
  greaterThanOrEqual?: string;
  inRange?: string;
  contains?: string;
  notContains?: string;
  startsWith?: string;
  endsWith?: string;
  lastYear?: string;
  lastMonth?: string;
  lastDay?: string;
  lastHour?: string;
  go?: string;
  column?: string;
  value?: string;
  export?: string;
  refresh?: string;
  revertChanges?: string;
  duplicate?: string;

  constructor() {
    this.empty = 'No data to display';
    this.loading = 'Loading...';
    this.clearFilters = 'Clear all filters';
    this.create = 'Create';
    this.delete = 'Delete';
    this.save = 'Save';
    this.close = 'Close';
    this.titleCreate = 'Create';
    this.titleUpdate = 'Update';
    this.titleDetailView = 'Detail view';
    this.search = 'Search...';
    this.selectAll = 'Select all';
    this.clear = 'Clear';
    this.equals = 'Equals';
    this.notEqual = 'Does not equal';
    this.lessThan = 'Is less than';
    this.lessThanOrEqual = 'Is less than or equal to';
    this.greaterThan = 'Is greater than';
    this.greaterThanOrEqual = 'Is greater than or equal to';
    this.inRange = 'In range';
    this.contains = 'Contains';
    this.notContains = 'Does not contain';
    this.startsWith = 'Begins with';
    this.endsWith = 'Ends with';
    this.lastYear = 'Last Year';
    this.lastMonth = 'Last Month';
    this.lastDay = 'Last Day';
    this.lastHour = 'Last Hour';
    this.go = 'Go';
    this.column = 'Column';
    this.value = 'Value';
    this.export = 'Export';
    this.refresh = 'Refresh';
    this.revertChanges = 'Revert Changes';
    this.duplicate = 'Duplicate';
  }

}
