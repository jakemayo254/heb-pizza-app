import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeleteOrderResponse } from '@src/app/models/delete-order.model';
import { Order, OrderRequest } from '@src/app/models/order.model';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

import { AuthRequest, AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class PizzaApiService {
  private readonly baseURL = environment.pizzaAPIAppBaseURL;
  private readonly ordersURL = this.baseURL + '/orders';
  private readonly authURL = this.baseURL + '/auth';

  constructor(private http: HttpClient) {}

  private getAuthHeader(authToken: string): HttpHeaders {
    return new HttpHeaders({
      authorization: `Bearer ${authToken}`,
    });
  }

  getAuthToken(authRequest: AuthRequest): Observable<HttpResponse<AuthResponse>> {
    return this.http.post<AuthResponse>(this.authURL, authRequest, {
      observe: 'response',
    });
  }

  getOrders(): Observable<HttpResponse<Order[]>> {
    return this.http.get<Order[]>(this.ordersURL, {
      observe: 'response',
    });
  }

  postOrder(order: OrderRequest, authToken: string): Observable<HttpResponse<Order>> {
    return this.http.post<Order>(this.ordersURL, order, {
      headers: this.getAuthHeader(authToken),
      observe: 'response',
    });
  }

  deleteOrder(orderID: number): Observable<HttpResponse<DeleteOrderResponse>> {
    return this.http.delete<DeleteOrderResponse>(`${this.ordersURL}/${orderID}`, {
      observe: 'response',
    });
  }
}
