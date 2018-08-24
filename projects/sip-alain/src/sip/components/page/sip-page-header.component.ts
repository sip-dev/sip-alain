import { Component, ContentChild, Input, OnInit, Optional, TemplateRef } from '@angular/core';
import { SipPageComponent } from './sip-page.component';

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
        <a (click)="close()" *ngIf="opener" class="sip-page-close" ><i class="anticon anticon-left-circle-o"></i></a>
        </h1>
    </div>`,
	styles: []
	
})
export class SipPageHeaderComponent implements OnInit {

    constructor(@Optional() private _page:SipPageComponent) {
    }
    
    ngOnInit() {
        if (!this._page) return;
        let page:SipPageComponent = this._page;
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
