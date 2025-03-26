import { EnvTag } from '@e2e-pw/enums/env-tag';
import { request } from '@playwright/test';
import { PizzaOrder } from '@src/app/models/pizza-order.model';

const pizzaAPIURL = process.env[EnvTag.pizzaAPIBaseURL] ?? '';
const testTableID = process.env[EnvTag.testTableID] ?? 0;

export async function deleteTestOrder(): Promise<void> {
  const context = await request.newContext({ baseURL: pizzaAPIURL });

  // Fetch all orders
  const getResponse = await context.get('/api/orders');
  if (!getResponse.ok()) {
    throw new Error(`Failed to fetch orders: ${getResponse.status()} ${getResponse.statusText()}`);
  }

  const orders = await getResponse.json();
  const orderToDelete = orders.find((order: PizzaOrder): boolean => order.Table_No === Number(testTableID));

  if (orderToDelete) {
    const deleteResponse = await context.delete(`/api/orders/${orderToDelete.Order_ID}`);

    if (deleteResponse.ok()) {
      console.log(`Successfully deleted order with ID ${orderToDelete.Order_ID}`);
    } else {
      throw new Error(`Failed to delete order: ${deleteResponse.status()} ${deleteResponse.statusText()}`);
    }
  } else {
    console.log(`No existing order found for table ID ${testTableID}`);
  }

  await context.dispose();
}
