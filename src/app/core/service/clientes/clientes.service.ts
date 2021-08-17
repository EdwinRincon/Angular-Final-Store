import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Clientes } from '@models/clientes.model';
import { environment } from '@environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  getAllClientes(ascDesc: string, like: string, desde: number) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<Clientes[]>(`${environment.url_api}/clientes?search=${like}&ordenar=${ascDesc}&desde=${desde}`).pipe(
      catchError(this.handleError)
    );
  }

  getCliente(payer_id: string) {
    return this.http.get<Clientes>(`${environment.url_api}/clientes/${payer_id}`).pipe(
      catchError(this.handleError)
    );
  }

  createCliente(cliente: Clientes) {
    return this.http.post<Clientes>(`${environment.url_api}/clientes`, cliente).pipe(
      catchError(this.handleError)
    );
  }

  updateCliente(id: string, changes: Partial<Clientes>) {
    return this.http.put(`${environment.url_api}/clientes/${id}`, changes).pipe(
      catchError(this.handleError)
    );
  }


  deleteCliente(id: string) {
    return this.http.delete(`${environment.url_api}/clientes/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  getNRegistrosCliente() {
    return this.http.get<number>(`${environment.url_api}/clientes/total/n`).pipe(
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
