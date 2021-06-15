import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Product } from '@models/product.model';
import { environment } from '@environments/environment';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  headers: HttpHeaders;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders().set('content-type', 'application/json');
  }


  getAllProducts(ascDesc: string, category: string, like: string, desde: number) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<Product[]>(`${environment.url_api}/productos?category=${category}&search=${like}&ordenar=${ascDesc}&desde=${desde}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  getProduct(name: string) {
    return this.http.get<Product>(`${environment.url_api}/productos/${name}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  createProduct(product: Product) {
    return this.http.post(`${environment.url_api}/productos/`, product, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(name: string, changes: Partial<Product>) {
    return this.http.put(`${environment.url_api}/productos/${name}`, changes, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(name: string) {
    return this.http.delete(`${environment.url_api}/productos/${name}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }


  getNRegistrosProduct() {
    return this.http.get<number>(`${environment.url_api}/productos/total/n`, { headers: this.headers });
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
