import { Component, ViewContainerRef } from '@angular/core';
import { Lib, SipAccess, SipAccessItem, SipAccessManager, SipMinitableManager, SipNgDestroy, SipNgInit, SipPage, SipProvidePages } from 'sip-alain';
import { ListFormComponent } from '../list-form/list-form.component';

@Component({
    selector: 'sip-list',
    templateUrl: './list.component.html',
    styles: [],
    providers: [...SipProvidePages(ListComponent)]
})
export class ListComponent extends SipPage {

    constructor(vcf: ViewContainerRef) {
        super(vcf);
    }

    params = { id: '' };

    //等效于ngOnInit, 但可以多次使用
    @SipNgInit()
    private _init() {
        this.params = this.$params(this.params);
        console.log('init', this.params);
    }

    @SipNgDestroy()
    private _destroy() {
        console.log('_destroy test in list');
    }

    @SipAccess<ListComponent>()
    accessManager: SipAccessManager;

    nzdata = [
        {
            num: "i-mysql",
            name: "mysql",
            status: "success",
            region: "开发云",
            ip: "10.202.0.8",
            spec: "2核2G",
            user: "开发账号",
            date: "2017-11-15"
        },
        {
            num: "i-instance",
            name: "实例",
            status: "error",
            region: "开发云",
            ip: "10.202.131.39",
            spec: "2核4G",
            user: "开发账号",
            date: "2017-11-15"
        },
        {
            num: "i-hbase",
            name: "hbase",
            status: "processing",
            region: "开发云",
            ip: "10.202.10.1",
            spec: "4核4G",
            user: "开发账号",
            date: "2017-11-15",
            children: [{
                num: "i-mysql",
                name: "mysql",
                status: "success",
                region: "开发云",
                ip: "10.202.0.8",
                spec: "2核2G",
                user: "开发账号",
                date: "2017-11-15"
            },
            {
                num: "i-instance",
                name: "实例",
                status: "error",
                region: "开发云",
                ip: "10.202.131.39",
                spec: "2核4G",
                user: "开发账号",
                date: "2017-11-15"
            }]
        }
    ];

    searchContent = {
        content: '',
        search: () => {
            this.tableManager.search({ content: this.searchContent.content });
        }
    };

    /**table管理器 */
    tableManager: SipMinitableManager<any> = new SipMinitableManager<any>({
        // connstr: 'iaas',
        // sqlId: 'iaas_Instance.List.GetByOwnerID',
        multiSelect: true,
        autoLoad: false,
        datas: this.nzdata,
        onSearch: (searchParams: object) => {
            Lib.extend(searchParams, {
                content: '', status: ''
            });
        },
        /** 过滤器设置 */
        filters: {
            /**列名 */
            status: {
                items: [
                    { text: '成功', value: 'success' },
                    { text: '处理中', value: 'processing' },
                    { text: '失败', value: 'error' }
                ],
                defaultValue: ['success'],
                onFilter: (p) => {
                    let values = p.values;
                    this.tableManager.search({ status: status });
                }
            }
        },
        tree: {
            childName: 'children'
        },
        /**初始化时触发，表示table已经可以使用 */
        onInit: () => {
            console.log('onInit tableManager1');
        },
        /**选择改变时触发 */
        onSelectChanged: (rows) => {
            this.accessManager.check(this.tableManager.selectDatas);
        },
        /**每次数据加载完成后并处理table业务时触发 */
        onCompleted: () => {
            console.log('onCompleted');
        },
        contextmenu: (menu, rows) => {
            if (!rows.length) { menu.items = []; return; };
            let row = rows[0], data = row.data;

            menu.items = [
                {
                    title: row.isEdit ? '保存' : '编辑',
                    disabled: false,
                    onClick: (p) => {
                        this.edit();
                    }
                }, {
                    title: '测试',
                    disabled: false,
                    onClick: (p) => {
                        this.test();
                    }
                }
            ];
        }
    });

    @SipAccessItem<ListComponent>('create', {
        multi: false, hasData: false,
        check: function () {
            return true;
        }
    })
    create() {
        let url = 'ui-demo/list-create';
        this.$navigate(url, { id: '' }).subscribe(r => {
            if (!r) return;
            console.log(url, r);
        });
    }

    @SipAccessItem<ListComponent>('test', {
        multi: false, hasData: true,
        check: function () {
            return true;
        }
    })
    test() {
        this.$modal(ListFormComponent, { id: '' }).subscribe(r => {
            if (!r) return;
            console.log('ListFormComponent', r);
        });
    }

    editText = '编辑';
    private _checkEditText() {
        let index = this.tableManager.selectRows.findIndex(function (item) { return item.isEdit; });
        this.editText = index > -1 ? '保存' : '编辑';
    }
    @SipAccessItem<ListComponent>('edit', {
        multi: true, hasData: true,
        check: function () {
            this._checkEditText();
            return true;
        }
    })
    edit() {
        let rows = this.tableManager.selectRows;
        if (rows.length == 0) return;
        let isEdit = this.editText == '保存';
        rows.forEach((row) => {
            this.tableManager.editRow([row.index], !isEdit);
        })

        this._checkEditText();
    }

}