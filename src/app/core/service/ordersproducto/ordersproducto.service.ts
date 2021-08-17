import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Ordersproducto } from '@models/ordersproducto.model';
import { environment } from '@environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class OrdersproductoService {

  constructor(private http: HttpClient) { }


  getAllOrdersProducto(ord: string, ascDesc: number, like: string, limit: number) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<Ordersproducto[]>(`${environment.url_api}/ordersproducto?search=${like}&ordenacion=${ord}&ascDesc=${ascDesc}&limit=${limit}`).pipe(
      catchError(this.handleError)
    );
  }

  getOrdersProducto(idOrder: string, idProduct: string) {
    return this.http.get<Ordersproducto>(`${environment.url_api}/ordersproducto/id/${idOrder}/${idProduct}`).pipe(
      catchError(this.handleError)
    );
  }

  createOrdersProducto(orderProducto: Ordersproducto) {
    return this.http.post(`${environment.url_api}/ordersproducto/`, orderProducto);
  }

  updateOrdersProducto(idOrder: string, idProduct: string, changes: Partial<Ordersproducto>) {
    return this.http.put(`${environment.url_api}/ordersproducto/${idOrder}/${idProduct}`, changes).pipe(
      catchError(this.handleError)
    );
  }

  deleteOrdersProducto(idOrder: string, idProduct: string) {
    return this.http.delete(`${environment.url_api}/ordersproducto/${idOrder}/${idProduct}`).pipe(
      catchError(this.handleError)
    );
  }

  getNRegistrosOrdesProducto() {
    return this.http.get<number>(`${environment.url_api}/ordersproducto/total/n`).pipe(
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
