import { HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SipPrepareData, SipRestDef, SipRestFunction, SipRestMethod, SipRestSqlDef, SipRestSqlFunction, SipRestSqlType, SipService } from 'sip-alain';
import { UserModel } from '../model/user.model';

@Injectable()
export class UserService extends SipService {

  constructor(injector: Injector) {
    super(injector);
   }

   @SipPrepareData()
   private _preData(owner){
       this.$logger.debug('UserService _preData', owner);
       return of(null).pipe(delay(3000));
   }
   @SipPrepareData()
   private _preData1(owner){
            let httpParams = new HttpParams({
                fromObject:{
                    a:'aaa',
                    b:null,
                    c:'false',
                    d:'a b'
                }
            });
       httpParams.set('bbb', '1111');
    //    httpParams.set('aaa', null);
       httpParams.set('bbb', '1111');
       httpParams.set('ccc', 'true');
       httpParams.set('ccc', 'false');
       this.$logger.debug('httpParams', httpParams.toString());
       this.$logger.debug('UserService _preData1', owner);
       return this.getUser({id:'111', test:true, role:null, testO:{a:1111}});
   }

   @SipRestDef<UserModel>({
       url: 'api/getuser',
       method: SipRestMethod.POST,
       cache: true,
       map: function (rs, target: UserService) {
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
       map: function (rs, target: UserService) {
           return rs.datas;
       }
   })
   getUserList: SipRestSqlFunction<{
       "content"?: string
   }, UserModel[]>;
}
