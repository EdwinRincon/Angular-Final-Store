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
  pass: any;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders().set('content-type', 'application/json');
  }

  login(email: string, password: string) {
    return this.http.post(`${environment.url_api}/auth/login`, { email, password }, { headers: this.headers }).pipe(
      catchError(this.handleError));
  }

  logout() {
    return this.http.post(`${environment.url_api}/auth/logout`, { headers: this.headers }).pipe(
      catchError(this.handleError));
  }

  hasPermission() {
    return this.http.get(`${environment.url_api}/auth/hasPermission`, { headers: this.headers });
  }

  // cambia contraseña
  resetPassword(token: string, pwd: string) {
    return this.http.post(`${environment.url_api}/auth/resetPwd?token=${token}`, { pwd }, { headers: this.headers }).pipe(
      catchError(this.handleError));
  }
  // envia email para solicitar el cambio
  forgotPassword(email: string) {
    return this.http.post(`${environment.url_api}/auth/forgot`, { email }, { headers: this.headers }).pipe(
      catchError(this.handleError));
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
