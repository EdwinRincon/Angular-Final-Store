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

  getAllClientes(ord: string, ascDesc: number, like: string, limit: number) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<Clientes[]>(`${environment.url_api}/clientes?search=${like}&ordenacion=${ord}&ascDesc=${ascDesc}&limit=${limit}`).pipe(
      catchError(this.handleError)
    );
  }

  getCliente(id: string) {
    return this.http.get<Clientes>(`${environment.url_api}/clientes/id/${id}`).pipe(
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
    return this.http.get<number>(`${environment.url_api}/clientes/total`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      Swal.fire({
        title: 'Error!',
        html: error.status + error.statusText +
              '<br></br>Error: ' + error.error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }


}