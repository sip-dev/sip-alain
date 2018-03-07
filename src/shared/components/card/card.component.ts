import { Component, ContentChild, Input } from '@angular/core';

@Component({
	selector: 'sip-card',
	template:`
		<nz-card [nzBordered]="bordered" [nzNoPadding]="noPadding" [nzNoHovering]="noHovering" [nzTitle]="title" [nzLoading]="loading">
			<ng-template [ngIf]="title1">
				<ng-template #title><ng-container [ngTemplateOutlet]="title1"></ng-container></ng-template>
			</ng-template>
			<ng-template #body><ng-container [ngTemplateOutlet]="body1"></ng-container></ng-template>
		</nz-card>
	`,
    styles:[]
})
export class CardComponent {

	@ContentChild('body') body1:any;
	@ContentChild('title') title1:any;
	@Input() bordered:boolean = true;
	@Input() noHovering:boolean = false;
	@Input() title:string;
	@Input() loading:boolean;
	@Input() noPadding:boolean;

}
