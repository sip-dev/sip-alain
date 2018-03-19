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

	private _filterItems:any[];
	public get filterItems():any[]{
		return this._filterItems;
	}
	//筛选菜单, [{value:'', text:'全部'}]
	@Input()
	public set filterItems(p:any[]){
		this._filterItems = p;
		this.filterValues = this.filterDefault;
	}
	//显示字段, text
	@Input() filterTextName = 'text';
	//取值字段, value
	@Input() filterValueName = 'value';
	@Input() filterDefault: any[];
	//筛选菜单callback:function(item){}
	@Input() filterCallback: (p: { values: any[]; items: any[]; column: MinicolumnComponent }) => void = Lib.noop;

	public get filterValues(): any[] {
		let vals = this.selectFilterItems.map((p) => { return p[this.filterValueName]; });
		return vals;
	}
	@Input()
	public set filterValues(values: any[]) {
		if (this.filterItems) {
			let has = !!values && values.length > 0;
			this.filterItems.forEach((p) => {
				p._filtersel = has && values.indexOf(p[this.filterValueName]) >= 0;
			})
		}
		let p = {
			values: values || [],
			items: this.filterItems || [],
			column: this
		};
		this.filterCallback && this.filterCallback(p)
	}

	getFilterItem(value: any) {
		let filterItems = this.filterItems;
		var index = filterItems ? filterItems.findIndex(item => item[this.filterValueName] == value) : -1;
		return index >= 0 ? filterItems[index] : null;
	}

	getFilterText(value: any) {
		let item = this.getFilterItem(value);
		return item && item[this.filterTextName] || value;
	}

	get selectFilterItems(): any[] {
		return this.filterItems ? this.filterItems.filter(item => item._filtersel) : [];
	}

	//#endregion

}
