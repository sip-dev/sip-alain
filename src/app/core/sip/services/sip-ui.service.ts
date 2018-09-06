import { Injectable, Injector } from '@angular/core';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { SipInject, SipLoggerService, SipService } from 'sip-alain';

@Injectable()
export class SipUiService extends SipService {

  constructor(injector: Injector) {
    super(injector);
  }

  /**消息 */
  @SipInject(NzMessageService)
  msg:NzMessageService;

  /**通知 */
  @SipInject(NzNotificationService)
  notifies:NzNotificationService;

  @SipInject(SipLoggerService)
  logger:SipLoggerService;

}
