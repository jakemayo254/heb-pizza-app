export interface OrderRequest {
  Table_No: number;
  Crust: string;
  Flavor: string;
  Size: string;
}

export interface Order extends OrderRequest {
    Order_ID: number;
    Timestamp: Date;
}
