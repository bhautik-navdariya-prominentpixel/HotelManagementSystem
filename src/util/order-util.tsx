import type { CartModel } from "../models/CartModel";
import type { OrderModel } from "../models/OrderModel";

const KEY = "orders";

export function getAllOrders(): OrderModel[] {
  return JSON.parse(localStorage.getItem(KEY) ?? "[]");
}

export function saveOrder(order: OrderModel) {
  const orders = getAllOrders();
  orders.push(order);
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function getCartOfTable(tableName: string): CartModel[]{
  const orders = getAllOrders();
  return orders.reverse().find(order=>order.table === tableName)?.items ?? [];
}
