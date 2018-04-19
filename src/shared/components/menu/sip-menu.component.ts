import { Component, Input, forwardRef } from '@angular/core';
import { SipMenuChildren } from './sip-menu-children';
import { ISipMenuItem } from './sip-menu-item';


@Component({
	selector: 'sip-menu',
	template: `
	<div class="ant-dropdown-menu" [style.width]="width">
		<ul nz-menu 
			[nzMode]="mode"
			[nzTheme]="theme"
			[nzInlineCollapsed]="inlineCollapsed">
			<ng-template #itemtmpl let-item="item">
				<li *ngIf="showItem(item)" nz-menu-item
					[nzSelected]="item.selected"
					(click)="item.onClick && item.onClick(item)">
					<i *ngIf="item.icon" [class]="item.icon"></i>{{item.title}}
				</li>
				<li *ngIf="showItemDivider(item)" nz-menu-item-divider></li>
			</ng-template>
			<ng-template ngFor let-item [ngForOf]="datas" let-i="index">
				<ng-container [ngTemplateOutlet]="itemtmpl" [ngTemplateOutletContext]="{item:item}"></ng-container>
				<li *ngIf="showItemSub(item)" nz-submenu [nzOpen]="item.open">
					<span title (click)="item.onClick && item.onClick(item)">
						<i *ngIf="item.icon" [class]="item.icon"></i>{{item.title}}
					</span>
					<ul>
						<ng-template ngFor let-citem [ngForOf]="item.children">
							<ng-container [ngTemplateOutlet]="itemtmpl" [ngTemplateOutletContext]="{item:citem}"></ng-container>
						</ng-template>
					</ul>
				</li>
				<li *ngIf="showItemGroup(item)" nz-menu-group>
					<span title>
						<i *ngIf="item.icon" class="anticon {{item.icon}}"></i>{{item.title}}
					</span>
					<ul>
						<ng-template ngFor let-citem [ngForOf]="item.children">
							<ng-container [ngTemplateOutlet]="itemtmpl" [ngTemplateOutletContext]="{item:citem}"></ng-container>
						</ng-template>
					</ul>
				</li>
			</ng-template>
		</ul>
	</div>
	`,
	styles: [],
	providers: [{ provide: SipMenuChildren, useExisting: forwardRef(() => SipMenuComponent) }],
})
export class SipMenuComponent implements SipMenuChildren {

	@Input() theme = 'light';//	主题颜色	string: light dark		light
	@Input() mode = 'vertical';//	菜单类型，现在支持垂直、水平、和内嵌模式三种	string: vertical horizontal inline		vertical
	@Input() inlineCollapsed = false;//	控制内嵌菜单的缩起/展开。	Boolean		false
	@Input() width = '130px';

	@Input() style: any;

	private _menuItem: ISipMenuItem;

	showItem(item: ISipMenuItem) {
		return !item.disabled && !item.group && !item.divider && !item.children;
	}

	showItemSub(item: ISipMenuItem) {
		return !item.disabled && !item.group && item.children;
	}

	showItemGroup(item: ISipMenuItem) {
		return !item.disabled && item.group;
	}

	showItemDivider(item: ISipMenuItem) {
		return !item.disabled && item.divider;
	}

	@Input() datas: ISipMenuItem[] = [];
	addChild(menu: ISipMenuItem) {
		this.datas.push(menu);
	}

}
