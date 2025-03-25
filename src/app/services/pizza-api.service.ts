import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeleteOrderResponse } from '@src/app/models/delete-order.model';
import { PizzaOrder, PizzaOrderRequest } from '@src/app/models/pizza-order.model';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

import { AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class PizzaApiService {
  private readonly baseURL = environment.pizzaAPIAppBaseURL;
  private readonly ordersURL = this.baseURL + '/orders';
  private readonly authURL = this.baseURL + '/auth';

  constructor(private readonly http: HttpClient) {}

  private getAuthHeader(authToken: string): HttpHeaders {
    return new HttpHeaders({
      authorization: `Bearer ${authToken}`,
    });
  }

  getAuthToken(username: string, password: string): Observable<HttpResponse<AuthResponse>> {
    return this.http.post<AuthResponse>(
      this.authURL,
      { username, password },
      {
        observe: 'response',
      }
    );
  }

  getOrders(): Observable<HttpResponse<PizzaOrder[]>> {
    return this.http.get<PizzaOrder[]>(this.ordersURL, {
      observe: 'response',
    });
  }

  postOrder(order: PizzaOrderRequest, authToken: string): Observable<HttpResponse<PizzaOrder>> {
    return this.http.post<PizzaOrder>(this.ordersURL, order, {
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
