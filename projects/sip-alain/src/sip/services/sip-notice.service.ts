import { Injectable } from '@angular/core';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';

@Injectable()
export class SipNoticeService {

  constructor(
    public message: NzMessageService,
    public notifies: NzNotificationService
  ) { }

}
