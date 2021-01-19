import { Component, OnInit, HostListener } from '@angular/core';

import { map } from 'rxjs/operators';
import { CartService} from '@core/service/cart.service';
import { Observable} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  installEvent = null;
  total$: Observable<number>;

  constructor(private cartService: CartService) {
  this.total$ = this.cartService.cart$
  .pipe(
      map(products => products.length)
    );
  }

  ngOnInit() {}

  // instalar aplicacion
  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.installEvent = event;
  }


  installByUser() {
    if (this.installEvent) {
      this.installEvent.prompt();
      this.installEvent.userChoice
      .then (rta => {});
    }
  }

  // Menu responsive
  hamburger() {
    const x = document.getElementById('demo');
    if (x.className.indexOf('w3-show') === -1) {
      x.className += ' w3-show';
    } else {
      x.className = x.className.replace(' w3-show', '');
    }
  }

}
