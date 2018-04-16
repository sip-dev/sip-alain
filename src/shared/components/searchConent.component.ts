import { Component, Input } from '@angular/core';

@Component({
    selector: 'sip-searchConent',
    template:`<nz-input-group nzSuffixIcon="anticon anticon-search" style="width: 220px;vertical-align: bottom;">
    <input type="text" nz-input placeholder="请输入" [(ngModel)]="params.content" (click)="click($event)" (keydown.enter)="search()">
</nz-input-group>`,
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
