import { Injectable, Injector } from '@angular/core';
import { SipRestDef, SipRestFunction, SipRestMethod, SipRestSqlDef, SipRestSqlFunction, SipRestSqlType, SipService } from 'sip-alain';
import { PlayerModel } from '../models/player.model';

@Injectable()
export class PlayerService extends SipService {

  constructor(injector: Injector) {
    super(injector);
  }

  @SipRestSqlDef<PlayerModel[]>({
      sqlType: SipRestSqlType.List,
      sqlId: 'iaas.instlist', connstr: 'iaas',
      sortName: 'name', sortOrder: 'asc',
      pageSize: 10,
        searchparam: { "content": "" },
      cache: true,
      map: function (rs, target) {
          return rs.datas;
      }
  })
  getPageList: SipRestSqlFunction<{
      "content"?: string
  }, PlayerModel[]>;
  
  @SipRestDef<PlayerModel[]>({
    url: 'api/demo/data-table/players',
    method: SipRestMethod.GET,
    cache: true,
    map: function (rs, target) {
      return rs.datas;
    }
  })
  getList: SipRestFunction<PlayerModel, PlayerModel[]>;

}
