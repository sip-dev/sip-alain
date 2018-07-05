import {
  Component, Output, EventEmitter, Input, ChangeDetectionStrategy, HostBinding
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: 'pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {

  @Input()
  public set itemsPerPage(value: number) {
    this._itemsPerPage = value;
    this.pages = this.getPages();
  }

  public get itemsPerPage(): number {
    return this._itemsPerPage;
  }

  @Input()
  public set totalItems(value: number) {
    this._totalItems = value;
    this.pages = this.getPages();
  }

  public get totalItems(): number {
    return this._totalItems;
  }

  @Input()
  public set currentPage(value: number) {
    const _previous = this._currentPage;
    this._currentPage = (value > this.totalPages()) ? this.totalPages() : (value || 1);

    if (_previous === this._currentPage || typeof _previous === 'undefined') {
      return;
    }
    this.pages = this.getPages();
  }

  public get currentPage(): number {
    return this._currentPage;
  }

  @Output() pageChanged = new EventEmitter();

  public pages: number[];
  protected _currentPage: number = 1;
  protected _itemsPerPage: number = 10;
  protected _totalItems: number = 0;

  @HostBinding('class') cssClass = 'pagination';

  public setPage(page: number, event ?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }

    if (event && event.target) {
      const target: any = event.target;
      target.blur();
    }
    if (page > 0 && page <= this.totalPages() && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChanged.emit(this.currentPage);
    }
  }

  public totalPages(): number {
    const totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil(this.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  }

  public getPages(): number[] {
    const maxSize: number = 5;
    const pages: number[] = [];
    let startPage = 1;
    const totalPages = this.totalPages();
    let endPage = totalPages;

    if (maxSize < totalPages) {
      startPage = Math.max(this.currentPage - Math.floor(maxSize / 2), 1);
      endPage = startPage + maxSize - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - maxSize + 1;
      }
    }
    for (let num = startPage; num <= endPage; num++) {
      pages.push(num);
    }
    return pages;
  }

}
