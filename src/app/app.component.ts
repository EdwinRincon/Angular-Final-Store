import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
// gtag analytics
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';



declare var gtag;
interface Token {
  token: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  private tokenCollections: AngularFirestoreCollection<Token>;

  // crea Tokens en la base de datos de Firebase
  // se utilizará para identificar al usuario y enviar notificaciones
  // solo si este lo permite
  constructor(
    private swUpdate: SwUpdate,
    private messaging: AngularFireMessaging,
    private database: AngularFirestore,
    private router: Router) {
      this.tokenCollections = this.database.collection<Token>('tokens');
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
  ngAfterViewInit() {
    this.requestPermission();
    this.listenNotifications();
  }

  ngOnInit() {
    this.updatePWA();
  }

  // si el Service Worker está desactualizado
  // se recarga la pagina para recibir los ultimos cambios
  updatePWA() {
    this.swUpdate.available.subscribe(value => {
      window.location.reload();
    });
  }

  // Si permite las notificaciones
  requestPermission() {
    this.messaging.requestToken
    .subscribe(token => {
      this.tokenCollections.add({token});
    });
  }

  // atento a las notificaciones
  listenNotifications() {
    this.messaging.messages.subscribe();
  }
}
