export interface PizzaOrderRequest {
  Table_No: number; // eslint-disable-line @typescript-eslint/naming-convention
  Crust: string; // eslint-disable-line @typescript-eslint/naming-convention
  Flavor: string; // eslint-disable-line @typescript-eslint/naming-convention
  Size: string; // eslint-disable-line @typescript-eslint/naming-convention
}

export interface PizzaOrder extends PizzaOrderRequest {
  Order_ID: number; // eslint-disable-line @typescript-eslint/naming-convention
  Timestamp: Date; // eslint-disable-line @typescript-eslint/naming-convention
}
