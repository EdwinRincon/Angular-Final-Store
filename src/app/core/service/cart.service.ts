import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { Product } from '@models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private products: Product[] = [];
  public cart = new BehaviorSubject<Product[]>([]);
  cart$ = this.cart.asObservable();
  p: any; // auxiliar producto
  totalAPagar: number;
  constructor() { }

  // añade un prodcuto al array
  addCart(product: Product) {
    this.products = [...this.products, product];
    this.cart.next(this.products);
    this.totalAPagar = this.TotalPaymentPreview(this.products);
  }

  // elimina del array 1 producto encontrandolo por su ID
  // si la cantidad es >1 , restará su cantidad y no lo elimina por completo
  async deleteCart(product: Product): Promise<number> {
    if (product.quantity === 0) {
    } else {
      if (this.products.find(this.p = p => p.name === product.name)) {
        this.products.splice(this.products.findIndex(this.p), 1);
        product.quantity = product.quantity - 1;
        this.cart.next(this.products);
        this.totalAPagar = this.TotalPaymentPreview(this.products);
      }
    }
    return this.totalAPagar;
  }

  // recorre el array de productos sumando todas las cantidades
  // y su precio, para retornar el valor Total a pagar
  TotalPaymentPreview(productos: Product[]) {
    let variable = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < productos.length; index++) {
      variable += productos[index].price;
    }
    return variable;
  }
}
