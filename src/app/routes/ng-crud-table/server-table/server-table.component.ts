import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SipAccessItem, SipInject, SipNgInit, SipPage, SipProvidePages, SipTableColumn, SipTableServerManager, SipTableSettings } from 'sip-alain';
import { ListFormComponent } from '../../ui-demo/list-form/list-form.component';
import { getColumnsPlayers } from '../shared/base/column';
import { PlayerService } from '../shared/services/player.service';

@Component({
  selector: 'sip-crud-table',
  templateUrl: './server-table.component.html',
  styleUrls: ['./server-table.component.less'],
  providers: [...SipProvidePages(ServerTableComponent)]
})
export class ServerTableComponent extends SipPage {

  constructor(private vcf: ViewContainerRef) {
    super(vcf);
  }

  params = { id: '' };

  /**等效于ngOnInit, 但可以多次使用 */
  @SipNgInit()
  private _init() {
    this.params = this.$params(this.params);
    console.log('init', this.params);
    this.$logger.log('init', this.params);
    this.$logger.warn('init', this.params);
    this.$logger.error('init', this.params);
    this.$logger.info('init', this.params);
    this.columns = getColumnsPlayers();
    this.columns[1].cellTemplate= this.templateName;
    this.columns[1].editable = false;
    this.tableManager = new SipTableServerManager(this.$injector(), this.columns, this.tableSettings);

    this.tableManager.events.selectionSource$.subscribe(()=>{
      let rows = this.tableManager.getSelectedRows();
      this.$access.check(rows);
    });
    this.tableManager.events.cellEditModeSource$.subscribe((p) => {
      this.editText = this.tableManager.isEditing ? '保存' : '编辑';
    });
  }

  public columns: SipTableColumn[];
  public tableManager: SipTableServerManager;

  @SipInject(PlayerService)
  private _playerSrv:PlayerService;

  @ViewChild('templateName') templateName: TemplateRef<any>;

  public tableSettings: SipTableSettings = new SipTableSettings({
    // sqlId: 'iaas.instlist', connstr: 'iaas',
    sortName: 'name', sortOrder: 'asc',
    pageSize: 10,
    editMode: 'editProgrammatically',
    restSrv:(param) => this._playerSrv.getPageList(null, param),
    rowActionTemplate:null,
    selectionMultiple:true,
    selectionMode: 'checkbox',
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
  }


}
