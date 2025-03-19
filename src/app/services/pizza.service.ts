import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '@src/app/models/order.model';
import { environment } from '@src/environments/environment';
import {AuthRequest, AuthResponse} from '../models/auth.model';
import {DeleteOrderResponse} from '@src/app/models/delete-order.model';

@Injectable({ providedIn: 'root' })
export class PizzaService {
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

  getAllOrders(): Observable<HttpResponse<Order[]>> {
    return this.http.get<Order[]>(this.ORDERS_URL, {
      observe: "response"
    });
  }

  createOrder(order: Order, authToken: string): Observable<HttpResponse<Order>> {
    return this.http.post<Order>(this.ORDERS_URL, order, {
      headers: this.getAuthHeader(authToken),
      observe: "response"
    });
  }

  deleteOrder(id: number): Observable<HttpResponse<DeleteOrderResponse>> {
    return this.http.delete<DeleteOrderResponse>(`${this.ORDERS_URL}/${id}`, {
      observe: 'response'
    });
  }
}
