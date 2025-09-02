import * as Yup from "yup";

export class MenuModel {
  id: string = Math.random().toString();
  name: string = "";
  price: number = 0;
}
export const MenuModelValidator = Yup.object({
  name: Yup.string().required("Menu name is required"),
  price: Yup.number().positive("Price must be positive").required("Price is required"),
});
