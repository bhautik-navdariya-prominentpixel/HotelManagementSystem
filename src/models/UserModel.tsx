export class UserModel {
  uid: string = Math.random().toString();
  username: string = "";
  password: string = "";
  fullname: string = "";
  isAdmin: boolean = false;
}
