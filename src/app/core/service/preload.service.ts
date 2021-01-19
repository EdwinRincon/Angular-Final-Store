import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreloadService implements PreloadingStrategy {

  // no se está utilizando
  // reemplazado por QuickLinkStrategy
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data.preload) {
    return load();
    } else {
      return of();
    }
  }


}
