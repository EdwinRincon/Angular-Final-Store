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


  getAllOrdersProducto(ascDesc: string, search: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<Ordersproducto[]>(`${environment.url_api}/ordenesProductos?search=${search}&ordenar=${ascDesc}`).pipe(
      catchError(this.handleError)
    );
  }

  getOrdersProducto(idOrder: string, name: string) {
    return this.http.get<Ordersproducto>(`${environment.url_api}/ordenesProductos/${idOrder}/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  createOrdersProducto(orderProducto: Ordersproducto) {
    return this.http.post(`${environment.url_api}/ordenesProductos`, orderProducto);
  }

  updateOrdersProducto(idOrder: string, name: string, changes: Partial<Ordersproducto>) {
    return this.http.put(`${environment.url_api}/ordenesProductos/${idOrder}/${name}`, changes).pipe(
      catchError(this.handleError)
    );
  }

  deleteOrdersProducto(idOrder: string, name: string) {
    return this.http.delete(`${environment.url_api}/ordenesProductos/${idOrder}/${name}`).pipe(
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
