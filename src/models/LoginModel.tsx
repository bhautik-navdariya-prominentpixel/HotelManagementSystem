import * as Yup from "yup";

export class LoginModel {
  username: string = "";
  password: string = "";
}
export const LoginModelValidator = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});
