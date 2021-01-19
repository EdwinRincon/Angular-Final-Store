import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders().set('content-type','application/json')
  }

  login(email: string, password: string) {
    return this.http.post(`${environment.url_api}/login`, { email, password }, { headers: this.headers }).pipe(
      catchError(this.handleError));
  }

  logout() {
    return this.http.post(`${environment.url_api}/logout`, { headers: this.headers }).pipe(
      catchError(this.handleError));
  }

  hasPermission() {
    let pass = false;
    this.http.get(`${environment.url_api}/hasPermission`, { headers: this.headers }).subscribe(canPass => {
      canPass === true ? pass === true : pass === false;
    });
    return pass;
  }

  // cambia contraseña
  resetPassword(token: string, pwd: string) {
    return this.http.post(`${environment.url_api}/resetPwd?token=${token}`,{pwd}, { headers: this.headers }).pipe(
      catchError(this.handleError));
  }
  // envia email para solicitar el cambio
  forgotPassword(email: string) {
    return this.http.post(`${environment.url_api}/forgot`, { email }, { headers: this.headers }).pipe(
      catchError(this.handleError));
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
        text: error.error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

}
