import { Component, OnInit, AfterViewInit, HostListener  } from '@angular/core';
import Swiper from 'swiper';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  mySwiper: Swiper;
  installEvent = null;
  constructor() { }

  ngOnInit() {
  }

  // Slider de imagenes
  ngAfterViewInit() {
    this.mySwiper = new Swiper('.swiper-container', {
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  // metodo nativo, instalar aplicacion
  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.installEvent = event;
  }

  // Boton instalar app
  installByUser() {
    if (this.installEvent) {
      this.installEvent.prompt();
      this.installEvent.userChoice
      .then (rta => {});
    }
  }
}
