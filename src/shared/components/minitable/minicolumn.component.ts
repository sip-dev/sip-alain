import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { Lib } from 'sip-lib';

@Component({
	selector: 'sip-minicolumn',
	template: ``,
	styles: []
})
export class MinicolumnComponent {

	//内容
	@ContentChild('formatter') formatter: TemplateRef<any>;
	//编辑用
	@ContentChild('editor') editor: TemplateRef<any>;

	//字段名称
	@Input() name = '';
	//列头显示内容
	@Input() title = '';
	//宽度
	@Input() width = '';
	//tooltip:top,left,right,bottom
	@Input() tooltip = null;
	//是否隐藏
	@Input() hide = false;

	@Input() group = ''

	//是否编辑
	@Input() isEdit = false

	index: number;
	count: number;

	//#region sort

	//是否可以排序
	@Input() sortable = false;
	//排序名称， 空为字段名称
	@Input() sortName = "";
	/**
	 * 排序方向, 可以值为('' | asc | desc)
	 */
	get sortOrder(): string {
		return this._sortOrder ? (this._sortOrder == 'descend' ? 'desc' : 'asc') : '';
	}
	@Input()
	set sortOrder(value: string) {
		this._sortOrder = value ? (value == 'desc' ? 'descend' : 'ascend') : '';
	}
	_sortOrder = '';

	//#endregion

	//#region filter

	//筛选菜单, [{value:'', text:'全部'}]
	@Input() filterItems: any[] = null;
	//显示字段, text
	@Input() filterText = 'text';
	//取值字段, value
	@Input() filterValue = 'value';
	//筛选菜单callback:function(item){}
	@Input() filterCallback: (p:{values: any[]; items: any[]; column: MinicolumnComponent}) => void = Lib.noop;
	//筛选菜单默认值
	@Input() filterDefault = '';

	getFilterItem(value: any) {
		let filterItems = this.filterItems;
		var index = filterItems ? filterItems.findIndex(item => item[this.filterValue] == value) : -1;
		return index >= 0 ? filterItems[index] : null;
	}

	getFilterText(value: any) {
		let item = this.getFilterItem(value);
		return item && item[this.filterText] || value;
	}

	get selectFilterItems(): any[] {
		return this.filterItems ? this.filterItems.filter(item => item._filtersel) : [];
	}

	//#endregion

}
