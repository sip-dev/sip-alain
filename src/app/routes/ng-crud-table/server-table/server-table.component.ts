import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SipAccessItem, SipInject, SipNgInit, SipPage, SipProvidePages, SipTableColumn, SipTableServerManager, SipTableSettings } from 'sip-alain';
import { AlertComponent } from '../../ui-demo/alert/alert.component';
import { ConfirmComponent } from '../../ui-demo/confirm/confirm.component';
import { ListFormComponent } from '../../ui-demo/list-form/list-form.component';
import { PromptComponent } from '../../ui-demo/prompt/prompt.component';
import { getColumnsPlayers } from '../shared/base/column';
import { PlayerModel } from '../shared/models/player.model';
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

  @SipInject(NzMessageService)
  private _msgSrv:NzMessageService;

  /**等效于ngOnInit, 但可以多次使用 */
  @SipNgInit()
  private _init() {
    
    this.params = this.$params(this.params);
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
  public tableManager: SipTableServerManager<PlayerModel>;

  @SipInject(PlayerService)
  private _playerSrv:PlayerService;

  @ViewChild('templateName') templateName: TemplateRef<any>;

  public tableSettings: SipTableSettings = new SipTableSettings({
    // sqlId: 'iaas.instlist', connstr: 'iaas',
    sortName: 'name', sortOrder: 'asc',
    // pageSize: 10,
    editMode: 'editProgrammatically',
    restSrv:(param) => this._playerSrv.getPageList(null, param),
    rowActionTemplate:null,
    selectionMultiple:true,
    contextmenuAction: (e, row) => {
      return {
        width: '100px',
        items: [{
          title: 'test',
          disabled: !this.$access.hasAccess('test'),
          onClick: (p) => {
            this.$logger.log('test', row);
          }
        },
        {
          title: 'test1',
          onClick: (p) => {
            this.$logger.log('test1', row);
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

  @SipAccessItem('refresh', {
    multi: false, hasData: false,
    check: function (datas:any[], target:any) {
      return true;
    }
  })
  refresh() {
    this.tableManager.refresh();
  }

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
      this.$logger.log(url, r);
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
    this.$logger.log('rows', rows);
    this.$modal(ListFormComponent, { id: '' }).subscribe(r => {
      if (!r) return;
      this.$logger.log('ListFormComponent', r);
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

  @SipAccessItem<ServerTableComponent>('alert', {
    multi: false, hasData: true,
    check: function () {
      return true;
    }
  })
  alert(){
    let data = this.tableManager.getSelectedFirstData();
    if (!data) return;
    this.$modal(AlertComponent, { id: data.id }).subscribe(r => {
        if (!r) return;
        this.tableManager.refresh();
        console.log('AlertComponent', r);
    });
  }

  @SipAccessItem<ServerTableComponent>('confirm', {
    multi: false, hasData: true,
    check: function () {
      return true;
    }
  })
  confirm(){
    let data = this.tableManager.getSelectedFirstData();
    if (!data) return;
    this.$modal(ConfirmComponent, { id: data.id }).subscribe(r => {
        if (!r) return;
        this.tableManager.refresh();
        console.log('ConfirmComponent', r);
    });
  }

  @SipAccessItem<ServerTableComponent>('prompt', {
    multi: false, hasData: true,
    check: function () {
      return true;
    }
  })
  prompt(){
    let data = this.tableManager.getSelectedFirstData();
    if (!data) return;
    this.$modal(PromptComponent, { id: data.id }).subscribe(r => {
        if (!r) return;
        this.tableManager.refresh();
        console.log('PromptComponent', r);
    });
  }

}
