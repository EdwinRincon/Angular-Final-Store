import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent   {

  // array de imagenes para el slider
  images: string[] = [
  'assets/images/banner-1.jpg',
  'assets/images/banner-2.jpg',
  'assets/images/banner-3.jpg'
];

}
