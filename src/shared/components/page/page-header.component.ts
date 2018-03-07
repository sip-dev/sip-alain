import { Component, OnInit, Input, ContentChild, TemplateRef, Optional } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ReuseTabService } from '@delon/abc';
import { PageComponent } from './page.component';

@Component({
    selector: 'sip-page-header',
    template: `<div class="content__title">
        <h1>
        <ng-template [ngIf]="menuText">{{menuText}}</ng-template>
        <ng-template [ngIf]="!menuText">
            <ng-container [ngTemplateOutlet]="title"></ng-container>
        </ng-template>
        <small class="text-sm hidden-xs" *ngIf="desc">
            <ng-template [ngIf]="menuDesc">{{menuDesc}}</ng-template>
            <ng-template [ngIf]="!menuDesc">
            <ng-container [ngTemplateOutlet]="desc"></ng-container>
            </ng-template>
        </small>
        <a (click)="close()" *ngIf="opener" >X</a>
        </h1>
    </div>`,
    styles: []
})
export class PageHeaderComponent implements OnInit {

    constructor(@Optional() private _page:PageComponent) {
    }
    
    ngOnInit() {
        if (!this._page) return;
        let page:PageComponent = this._page;
        if (page.title){
            this.navigator = page.title;
            this.menuText = page.title;
        }
        else
            page.title = this.navigator;

        if (page.desc)
            this.menuDesc = page.desc;

    }

    menuText: string;
    menuDesc: string;

    @ContentChild('title') title: TemplateRef<any>;
    @ContentChild('desc') desc: TemplateRef<any>;
    @Input() navigator: string;
    _paths: any[];

    get opener(){
        return !!(this._page && this._page.$business.$uiLink.opener);
    }

    close(){
        this._page && this._page.$business.$close();
    }

}
