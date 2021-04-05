import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
// gtag analytics
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private swUpdate: SwUpdate, private router: Router) {
    // conseguir la ruta en el momento para enviarla a Google Analytics
    const navEndEvents$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      );
    // Google Analytics
    navEndEvents$.subscribe((event: NavigationEnd) => {
      gtag('config', 'UA-165388924-1', {
        page_path: event.urlAfterRedirects
      });
    });
  }

  ngOnInit() {
    this.updatePWA();
  }

  // si el Service Worker está desactualizado
  // se recarga la pagina para recibir los ultimos cambios
  updatePWA() {
    this.swUpdate.available.subscribe(() => {
      window.location.reload();
    });
  }

}
