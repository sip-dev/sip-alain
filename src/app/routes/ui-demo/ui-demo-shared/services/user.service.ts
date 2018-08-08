import { Injectable, Injector } from '@angular/core';
import { SipRestDef, SipRestFunction, SipRestMethod, SipRestSqlDef, SipRestSqlFunction, SipRestSqlType, SipService } from 'sip-alain';
import { UserModel } from '../model/user.model';

@Injectable()
export class UserService extends SipService {

  constructor(injector: Injector) {
    super(injector);
    /**使用getUserList */
    this.getUserList({content:'111'}).subscribe((rs)=>{
      console.log(rs.datas);
    })
   }

   @SipRestDef<UserModel>({
       url: 'api/getuser',
       method: SipRestMethod.GET,
       cache: true,
       map: function (rs, target) {
           return rs.datas;
       }
   })
   getUser: SipRestFunction<UserModel, UserModel>;


   @SipRestSqlDef<UserModel[]>({
       sqlType: SipRestSqlType.List,
       connstr: 'uam',
       sqlId: 'uam.UserModel.list',
       searchparam: { "content": "" },
       cache: true,
       map: function (rs, target) {
           return rs.datas;
       }
   })
   getUserList: SipRestSqlFunction<{
       "content"?: string
   }, UserModel[]>;
}
