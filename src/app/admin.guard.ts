import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@core/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  pass: boolean;
  constructor(private authService: AuthService, private router: Router) { }
  // si hay un usuario (NO) logeado en Firebase redirecciona
  // para que inicie sesion,  si ya está logeado podrá pasar por el guardian
  // this.router.navigate(['/auth/login']);
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    const hasPermission = () => {
      return this.authService.hasPermission().toPromise();
    };

    return hasPermission().then((p: boolean) => {
      if (!p) {
        this.router.navigate(['/auth/login']);
        return p;
      }
      return p;
    });
  }
}
