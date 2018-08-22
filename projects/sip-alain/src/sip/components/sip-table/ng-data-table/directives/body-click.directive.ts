import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { DataTable, EventHelper } from '../base';

@Directive({
    selector: '[appBodyClick]'
})
export class BodyClickDirective implements OnInit, OnDestroy {

    @Input() table: DataTable;

    element: HTMLElement;

    constructor(element: ElementRef, private ngZone: NgZone) {
        this.element = element.nativeElement;
    }

    ngOnInit(): void {
        this.ngZone.runOutsideAngular(() => {
            this.element.addEventListener('click', this.onClick.bind(this));
        });
    }

    ngOnDestroy(): void {
        this.element.removeEventListener('click', this.onClick.bind(this));
    }

    onClick(event: any): void {
        const cellEventArgs = EventHelper.findCellEvent(event, this.element);
        if (cellEventArgs) {
            this.ngZone.run(() => {
                this.table.checkSelectByMode(cellEventArgs);
                this.table.events.onClickCell(cellEventArgs);
            });
        }
    }

}
