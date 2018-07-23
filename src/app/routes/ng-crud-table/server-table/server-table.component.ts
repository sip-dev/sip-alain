import { Component, ViewContainerRef } from '@angular/core';
import { Column, DataSource } from '@shared/components/ng-crud-table';
import { SipTableServerManager, SipTableSettings } from '@shared/components/sip-table';
import { SipAccessItem, SipNgInit, SipPage, SipProvidePages } from 'sip-alain';
import { ListFormComponent } from '../../ui-demo/list-form/list-form.component';
import { getColumnsPlayers } from '../shareds/column';

@Component({
  selector: 'sip-crud-table',
  templateUrl: './server-table.component.html',
  styleUrls: ['./server-table.component.less'],
  providers: [...SipProvidePages(ServerTableComponent)]
})
export class ServerTableComponent extends SipPage {

  constructor(private vcf: ViewContainerRef) {
    super(vcf);
    this.columns = getColumnsPlayers();
    this.tableManager = new SipTableServerManager(vcf.injector, this.columns, this.serverSideSettings);

    this.tableManager.events.selectionSource$.subscribe(()=>{
      let rows = this.tableManager.getSelectedRows();
      this.$access.check(rows);
    });
  }

  params = { id: '' };

  /**等效于ngOnInit, 但可以多次使用 */
  @SipNgInit()
  private _init() {
    this.params = this.$params(this.params);
    console.log('init', this.params);
  }

  public service: DataSource;
  public columns: Column[];
  public tableManager: SipTableServerManager;

  public serverSideSettings: SipTableSettings = new SipTableSettings({
    sqlId: 'iaas.instlist', connstr: 'iaas',
    sortName: 'name', sortOrder: 'asc',
    pageSize: 10,
    editMode: 'editProgrammatically',
    contextmenuAction: (e, row) => {
      return {
        width: '100px',
        items: [{
          title: 'test',
          onClick: (p) => {
            console.log('test', row);
          }
        },
        {
          title: 'test1',
          onClick: (p) => {
            console.log('test1', row);
          }
        }]
      };
    }
  });

  searchContent = {
    content: '',
    search: () => {
      this.tableManager.search({
        content: this.searchContent.content
      });
    }
  };

  @SipAccessItem<ServerTableComponent>('create', {
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

  @SipAccessItem<ServerTableComponent>('test', {
    multi: false, hasData: true,
    check: function () {
      return true;
    }
  })
  test() {
    let rows = this.tableManager.getSelectedRows();
    console.log('rows', rows);
    this.$modal(ListFormComponent, { id: '' }).subscribe(r => {
      if (!r) return;
      console.log('ListFormComponent', r);
    });
  }

  editText = '编辑';
  @SipAccessItem<ServerTableComponent>('edit', {
    multi: true, hasData: true,
    check: function () {
      this.editText = this.tableManager.isEditing ? '保存' : '编辑';
      return true;
    }
  })
  edit() {

    let isEditing = !this.tableManager.isEditing;
    if (isEditing){
      this.tableManager.getSelectedRows().forEach((row) => {
        for (let colIndex = 0; colIndex < 6; colIndex++)
          this.tableManager.editCell(row.$$index, colIndex, isEditing);
      });
    } else {
      this.tableManager.unEditCellAll();
    }
    this.editText = this.tableManager.isEditing ? '保存' : '编辑';
  }


}
