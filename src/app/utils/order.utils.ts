import { Order } from "@src/app/models/order.model";

export function getOrderKey(order: Order): string {
    return order.Table_No + "-" + order.Size + "-" + order.Crust + "-" + order.Flavor;
}