import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeleteOrderResponse } from '@src/app/models/delete-order.model';
import { Order, OrderRequest } from '@src/app/models/order.model';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

import { AuthRequest, AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class PizzaApiService {
  private readonly BASE_URL = environment.pizzaAPIAppBaseURL;
  private readonly ORDERS_URL = this.BASE_URL + "/orders";
  private readonly AUTH_URL = this.BASE_URL + "/auth";

  constructor(private http: HttpClient) { }

  private getAuthHeader(authToken: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
  }

  getAuthToken(authRequest: AuthRequest): Observable<HttpResponse<AuthResponse>> {
    return this.http.post<AuthResponse>(this.AUTH_URL, authRequest, {
      observe: "response"
    });
  }

  getOrders(): Observable<HttpResponse<Order[]>> {
    return this.http.get<Order[]>(this.ORDERS_URL, {
      observe: "response"
    });
  }

  postOrder(order: OrderRequest, authToken: string): Observable<HttpResponse<Order>> {
    return this.http.post<Order>(this.ORDERS_URL, order, {
      headers: this.getAuthHeader(authToken),
      observe: "response"
    });
  }

  deleteOrder(orderID: number): Observable<HttpResponse<DeleteOrderResponse>> {
    return this.http.delete<DeleteOrderResponse>(`${this.ORDERS_URL}/${orderID}`, {
      observe: 'response'
    });
  }
}
