import { Injectable, Injector } from '@angular/core';
import { SipRestDef, SipRestFunction, SipRestMethod, SipService } from 'sip-alain';
import { PlayerModel } from '../models/player.model';

@Injectable()
export class PlayerService extends SipService {

  constructor(injector: Injector) {
    super(injector);
  }

  @SipRestDef<PlayerModel[]>({
      url: 'api/demo/data-table/players',
      method: SipRestMethod.GET,
      cache: true,
      map: function (datas, rs) {
          return datas;
      }
  })
  getList: SipRestFunction<PlayerModel, PlayerModel[]>;

}
