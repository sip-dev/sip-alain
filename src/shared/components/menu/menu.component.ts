import { Component, Input, forwardRef } from '@angular/core';

import { NzMenuComponent, NzSubMenuComponent, NzMenuGroupComponent } from 'ng-zorro-antd';
import { MenuChildren } from './menu-children';
import { IMenuItem } from './menu-item';

@Component({
	selector: 'sip-menu',
	template: `
	<div class="ant-dropdown-menu" [style.width]="width">
		<ul nz-menu 
			[nzMode]="mode"
			[nzTheme]="theme"
			[nzInlineCollapsed]="inlineCollapsed"
			[nzClickActive]="active">
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
	providers: [NzMenuComponent, NzSubMenuComponent, NzMenuGroupComponent,
		{ provide: MenuChildren, useExisting: forwardRef(() => MenuComponent) }],
})
export class MenuComponent implements MenuChildren {

	@Input() theme = 'light';//	主题颜色	string: light dark		light
	@Input() mode = 'vertical';//	菜单类型，现在支持垂直、水平、和内嵌模式三种	string: vertical horizontal inline		vertical
	@Input() inlineCollapsed = false;//	控制内嵌菜单的缩起/展开。	Boolean		false
	@Input() active = true;//	点击后是否选中子菜单	Boolean		true
	@Input() width = '130px';

	@Input() style: any;

	private _menuItem:IMenuItem;

	showItem(item:IMenuItem){
		return !item.disabled && !item.group && !item.divider && !item.children;
	}

	showItemSub(item:IMenuItem){
		return !item.disabled && !item.group && item.children;
	}

	showItemGroup(item:IMenuItem){
		return !item.disabled && item.group;
	}

	showItemDivider(item:IMenuItem){
		return !item.disabled && item.divider;
	}

	@Input() datas:IMenuItem[] = [];
	addChild(menu:IMenuItem){
		this.datas.push(menu);
	}

}
