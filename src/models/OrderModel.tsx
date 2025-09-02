import type { CartModel } from "./CartModel";

export class OrderModel {
  id: string = Math.random().toString();
  table: string = "T01";
  items: CartModel[] = [];
  total: number = 0;
  waiter: string = "";
  date: Date = new Date();
}
