import {Component, Input } from '@angular/core';

import { Product } from '@core/models/product.model';
import { CartService} from '@core/service/cart.service';


@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
  })
  export class ProductComponent {
    @Input() producto: Product;

  constructor(private cartService: CartService) {}

    // agrega un producto al array de productos a comprar
    addCart() {
    this.cartService.addCart(this.producto);
    }
}
