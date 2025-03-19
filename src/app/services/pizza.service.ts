import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '@src/app/models/order.model';
import { environment } from '@src/environments/environment';
import { AuthDetails } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class PizzaService {
  private readonly BASE_URL = environment.pizzaAPIAppBaseURL;
  private readonly ORDERS_URL = this.BASE_URL + "/orders";
  private readonly AUTH_URL = this.BASE_URL + "/auth";

  constructor(private http: HttpClient) {}

  private getAuthHeader(authToken: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
  }

  getAuthToken(authDetails: AuthDetails): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(this.AUTH_URL, authDetails);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ORDERS_URL);
  }

  createOrder(order: Order, authToken: string): Observable<Order> {
    return this.http.post<Order>(this.ORDERS_URL, order, { headers: this.getAuthHeader(authToken) });
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.ORDERS_URL}/${id}`);
  }
}
