import { Component, ContentChild, Input } from '@angular/core';

@Component({
	selector: 'sip-card',
	template:`
		<nz-card [nzBordered]="bordered" [nzHoverable]="hoverable" [nzTitle]="_nzTitle" [nzLoading]="loading"
			[nzExtra]="extra1">
			<ng-template [ngTemplateOutlet]="body1"></ng-template>
		</nz-card>
	`,
    styles:[]
})
export class CardComponent {

	get _nzTitle(){
		return this.title1 || this.title;
	}

	@ContentChild('body') body1:any;
	@ContentChild('extra') extra1:any;
	@ContentChild('title') title1:any;
	@Input() bordered:boolean = true;
	@Input() hoverable:boolean = false;
	@Input() title:string;
	@Input() loading:boolean;

}
