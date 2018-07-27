export class UserModel {

  id?:string = '';
  
  constructor(init?: Partial<UserModel>) {
    if (init) {
      Object.assign(this, init);
    }
  }

}
