import { AfterContentInit, Component, ContentChild, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef } from '@angular/core';
import { SipTabsetBodyComponent } from './sip-tabset-body.component';
import { SipTabsetHeaderComponent } from './sip-tabset-header.component';
import { SipTabsetTitleComponent } from './sip-tabset-title.component';

@Component({
    selector: 'sip-tabset',
    template: `
    <ng-template [ngIf]="titleOnly">
        <nz-tabset [(nzSelectedIndex)]="selectedIndex"
            (nzSelectedIndexChange)="_changeIndex()"
            (nzSelectChange)="selectChange.emit($event)"
            (nzOnNextClick)="onNextClick.emit($event)"
            (nzOnPrevClick)="onPrevClick.emit($event)"
            [nzAnimated]="animated" [nzSize]="size"
            [nzTabBarExtraContent]="tabBarExtraContent"
            [nzTabBarStyle]="tabBarStyle" [nzTabBarGutter]="tabBarGutter"
            [nzTabPosition]="tabPosition" [nzType]="type" [nzHideAll]="hideAll"
            [nzShowPagination]="showPagination">
            <nz-tab *ngFor="let title of titles; let index=index" [nzTitle]="title.template"
                [nzDisabled]="title.disabled"
                (nzClick)="title.click.emit($event)"
                (nzSelect)="title.select.emit($event)"
                (nzDeselect)="title.deselect.emit($event)"></nz-tab>
        </nz-tabset>
    </ng-template>
    <ng-template [ngIf]="!titleOnly">
        <nz-tabset [(nzSelectedIndex)]="selectedIndex"
            (nzSelectedIndexChange)="_changeIndex()"
            (nzSelectChange)="selectChange.emit($event)"
            (nzOnNextClick)="onNextClick.emit($event)"
            (nzOnPrevClick)="onPrevClick.emit($event)"
            [nzAnimated]="animated" [nzSize]="size"
            [nzTabBarExtraContent]="tabBarExtraContent"
            [nzTabBarStyle]="tabBarStyle" [nzTabBarGutter]="tabBarGutter"
            [nzTabPosition]="tabPosition" [nzType]="type" [nzHideAll]="hideAll"
            [nzShowPagination]="showPagination">
            <nz-tab *ngFor="let title of header.titles; let index=index" [nzTitle]="title.template"
                [nzDisabled]="title.disabled"
                (nzClick)="title.click.emit($event)"
                (nzSelect)="title.select.emit($event)"
                (nzDeselect)="title.deselect.emit($event)">
                <ng-template [ngIf]="body" [ngTemplateOutlet]="body?.contents[index].template"></ng-template>
            </nz-tab>
        </nz-tabset>
    </ng-template>`,
    styles: []
})
export class SipTabsetComponent implements AfterContentInit {
    @ContentChild(SipTabsetHeaderComponent) header: SipTabsetHeaderComponent;
    @ContentChild(SipTabsetBodyComponent) body: SipTabsetBodyComponent;
    @ContentChildren(SipTabsetTitleComponent) titles: QueryList<SipTabsetTitleComponent>;

    get titleOnly(): boolean {
        return this.titles && this.titles.length > 0;
    }

    ngAfterContentInit() {
        this._changeContent(this.selectedIndex, function (content) {
            content.contentOnly = true;
        });
    }

    private _changeContent(index: number, callback?: any) {
        if (this.titleOnly) {
            this.titles.forEach((p, idx) => {
                let content = p.content;
                if (content) {
                    content.display = (index == idx) ? '' : 'none';
                    callback && callback(content);
                }
            });
        }
    }

    _changeIndex() {
        let index = this.selectedIndex;
        this._changeContent(index);
        this.selectedIndexChange.emit(index);
    }

    @Output() selectedIndexChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() selectChange: EventEmitter<number> = new EventEmitter<number>();

    @Input() selectedIndex = 0;

    @Input() showPagination = true;
    @Input() animated = false;
    @Input() size = "default";
    @Input() tabBarExtraContent:TemplateRef<void>;
    @Input() tabBarStyle:object;
    @Input() tabPosition = 'top';

    @Input() type = "line";
    @Output() onNextClick: EventEmitter<void> = new EventEmitter<void>();
    @Output() onPrevClick: EventEmitter<void> = new EventEmitter<void>();
    @Input() tabBarGutter:number;
    @Input() hideAll = false;

}
