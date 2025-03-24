import { Order } from '@src/app/models/order.model';
import { OrderFilterPipe } from '@src/app/pipes/order-filter.pipe';

describe('OrderFilterPipe', (): void => {
  let pipe: OrderFilterPipe;

  /* eslint-disable @typescript-eslint/naming-convention */
  const mockOrders: Order[] = [
    {
      Flavor: 'Pepperoni',
      Size: 'Large',
      Crust: 'Thin',
      Table_No: 12,
      Order_ID: 101,
      Timestamp: new Date('2024-03-01T12:00:00Z'),
    },
    {
      Flavor: 'Veggie',
      Size: 'Medium',
      Crust: 'Thick',
      Table_No: 5,
      Order_ID: 102,
      Timestamp: new Date('2024-03-02T14:30:00Z'),
    },
    {
      Flavor: 'Cheese',
      Size: 'Small',
      Crust: 'Stuffed',
      Table_No: 8,
      Order_ID: 103,
      Timestamp: new Date('2024-03-03T16:15:00Z'),
    },
  ];

  beforeEach((): void => {
    pipe = new OrderFilterPipe();
  });

  it('should return all orders if searchText is null', (): void => {
    const result = pipe.transform(mockOrders, null);
    expect(result.length).toBe(3);
  });

  it('should return all orders if searchText is empty', (): void => {
    const result = pipe.transform(mockOrders, '');
    expect(result.length).toBe(3);
  });

  it('should return empty array if orders is null', (): void => {
    const result = pipe.transform(null, 'pepperoni');
    expect(result).toEqual([]);
  });

  it('should filter orders by Flavor', (): void => {
    const result = pipe.transform(mockOrders, 'pepperoni');
    expect(result.length).toBe(1);
    expect(result[0].Flavor).toBe('Pepperoni');
  });

  it('should filter orders by Size', (): void => {
    const result = pipe.transform(mockOrders, 'medium');
    expect(result.length).toBe(1);
    expect(result[0].Size).toBe('Medium');
  });

  it('should filter orders by Crust', (): void => {
    const result = pipe.transform(mockOrders, 'stuffed');
    expect(result.length).toBe(1);
    expect(result[0].Crust).toBe('Stuffed');
  });

  it('should filter orders by Table_No', (): void => {
    const result = pipe.transform(mockOrders, '5');
    expect(result.length).toBe(1);
    expect(result[0].Table_No).toBe(5);
  });

  it('should filter orders by Order_ID', (): void => {
    const result = pipe.transform(mockOrders, '103');
    expect(result.length).toBe(1);
    expect(result[0].Order_ID).toBe(103);
  });

  it('should be case insensitive', (): void => {
    const result = pipe.transform(mockOrders, 'PEPPERONI');
    expect(result.length).toBe(1);
    expect(result[0].Flavor).toBe('Pepperoni');
  });

  it('should return empty array if no match found', (): void => {
    const result = pipe.transform(mockOrders, 'notfound');
    expect(result).toEqual([]);
  });
});
