import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) {

  }

  sendMessage(email) {
    return this.http.post(`${environment.url_api}/sendemail`, email).pipe(
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
        html: error.error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
