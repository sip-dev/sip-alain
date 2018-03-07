import { Component, Input } from '@angular/core';

@Component({
    selector: 'sip-searchConent',
    template:`<nz-input [(ngModel)]="params.content" (click)="click($event)" (keydown.enter)="search()" [nzType]="'search'" [nzPlaceHolder]="'请输入'"  style="width:220px;vertical-align: bottom;"></nz-input>`,
    styles:[]
})
export class SearchConentComponent {

    @Input()
    params = {
		content: '',
		search(){}
    };

    search(){
        if (!this.params) return;
        this.params.search();
    }

    click(event){
        if (event && event.srcElement){
            if (/^i$/i.test(event.srcElement.tagName)){
                this.search();
            }
        }
    }

}
