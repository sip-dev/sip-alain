import { Component, ContentChild, Input, ContentChildren, TemplateRef, QueryList } from '@angular/core';
import { SipCardTitleComponent } from './sip-card-title.component';
import { SipCardBodyComponent } from './sip-card-body.component';
import { SipCardExtraComponent } from './sip-card-extra.component';
import { SipCardTabComponent } from './sip-card-tab.component';
import { SipCardMetaComponent } from './sip-card-meta.component';
import { SipCardActionComponent } from './sip-card-action.component';
import { SipCardCoverComponent } from './sip-card-cover.component';
import { SipCardGridComponent } from './sip-card-grid.component';

@Component({
	selector: 'sip-card',
	template: `<nz-card [nzBordered]="bordered" [nzHoverable]="hoverable" [nzTitle]="title?.template" [nzLoading]="loading"
			[nzExtra]="extra?.template" [nzCover]="cover?.template" [nzActions]="actions"
			[nzBodyStyle]="bodyStyle" [nzType]="type">
			<nz-card-tab *ngIf="!!tab">
				<ng-template [ngTemplateOutlet]="tab.template"></ng-template>
			</nz-card-tab>
			<div nz-card-meta *ngIf="!!meta" [nzTitle]="meta?.title?.template" [nzDescription]="meta?.desc?.template" [nzAvatar]="meta?.avatar?.template"></div>
			<ng-template [ngTemplateOutlet]="body?.template"></ng-template>
			<div nz-card-grid *ngFor="let item of grids" [ngStyle]="item.gridStyle">
				<ng-template [ngTemplateOutlet]="item.template"></ng-template>
			</div>
		</nz-card>`,
	styles: []
})
export class CardComponent {

	@ContentChild(SipCardTitleComponent) title: SipCardTitleComponent;
	@ContentChild(SipCardBodyComponent) body: SipCardBodyComponent;
	@ContentChild(SipCardExtraComponent) extra: SipCardExtraComponent;
	@ContentChild(SipCardTabComponent) tab: SipCardTabComponent;
	@ContentChild(SipCardMetaComponent) meta: SipCardMetaComponent;
	@ContentChild(SipCardCoverComponent) cover: SipCardCoverComponent;

	@ContentChildren(SipCardActionComponent) _actions: QueryList<SipCardActionComponent>;
	get actions(): TemplateRef<any>[] {
		return this._actions.map((p) => { return p.template; });
	}

	@ContentChildren(SipCardGridComponent) grids: QueryList<SipCardGridComponent>;

	@Input() bordered: boolean = true;
	@Input() hoverable: boolean = false;
	@Input() loading: boolean = false;
	@Input() bodyStyle: object;
	@Input() type: string;

}
