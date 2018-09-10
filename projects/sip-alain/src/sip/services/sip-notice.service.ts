import { Injectable, Injector } from '@angular/core';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';

@Injectable()
export class SipNoticeService {

  constructor(
    private _injector:Injector
  ) { }


  private _message: NzMessageService;
  public get message(): NzMessageService {
    return this._message || (this._message = this._injector.get(NzMessageService));
  }
  private _notifies: NzNotificationService;
  public get notifies(): NzNotificationService {
    return this._notifies || (this._notifies = this._injector.get(NzNotificationService));
  }


}
