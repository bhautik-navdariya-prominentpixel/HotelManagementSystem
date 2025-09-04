import type { CartModel } from "./CartModel";

export interface TableCartModel{
  id: string;
  name: string;
  cart: CartModel[]
}