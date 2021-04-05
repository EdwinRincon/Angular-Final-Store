import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Orders } from '@models/orders.model';
import { environment } from '@environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  createOrder(order: Orders) {
    return this.http.post(`${environment.url_api}/orders/`, order).pipe(
      catchError(this.handleError)
    );
  }

  getAllOrders(ord: string, ascDesc: number, like: string, limit: number) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<Orders[]>(`${environment.url_api}/orders?search=${like}&ordenacion=${ord}&ascDesc=${ascDesc}&limit=${limit}`).pipe(
      catchError(this.handleError)
    );
  }

  getOrder(idOrder: string) {
    return this.http.get<Orders>(`${environment.url_api}/orders/id/${idOrder}`).pipe(
      catchError(this.handleError)
    );
  }

  updateOrder(idOrder: string, changes: Partial<Orders>) {
    return this.http.put(`${environment.url_api}/orders/${idOrder}`, changes).pipe(
      catchError(this.handleError)
    );
  }

  deleteOrder(idOrder: string) {
    return this.http.delete(`${environment.url_api}/orders/id/${idOrder}`).pipe(
      catchError(this.handleError)
    );
  }

  getNRegistrosOrders() {
    return this.http.get<number>(`${environment.url_api}/orders/total`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    Swal.fire({
      title: 'Error!',
      text: error.error.message,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

}
