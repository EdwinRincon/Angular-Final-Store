import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';

@Pipe({
  name: 'cartRepeat',
})
export class CartRepeatPipe implements PipeTransform {
  /** CONVERTIR ARRAY DE PRODUCTOS REPETIDOS A UN ARRAY SIN PRODUCTOS REPETIDOS, SUMANDO SU CANTIDAD REPETIDA
   *
   * recibe un Array de productos, el cual los introduce en un nuevo array VACIO
   * si el array nuevo está vacio, entonces introduce ese producto, con cantidad = 1
   * si el array ya tiene datos, pero ese producto no está (busqueda por ID), cantidad =1
   * si el array ya tiene ddtos y ya está ese mismo producto en este, la cantidad ira acumulando cantidad += 1
   * finalmente al recorrer el array recibido, retornará el nuevo con productos sin repetir con sus cantidades repetidas
   */

  groupedProducts: any[] = [];
  p: any;
  transform(value: Product[]): Product[] {
    for (const iterator of value) {
      if (this.groupedProducts.length === 0) {
        this.groupedProducts.push(Object.assign(iterator, { quantity: 1 }));
      } else {
        if (!this.groupedProducts.find((this.p = (p) => p.name === iterator.name))) {
          this.groupedProducts.push(Object.assign(iterator, { quantity: 1 }));
        } else {
          const repeatedProduct = this.groupedProducts.findIndex(this.p);
          this.groupedProducts[repeatedProduct].quantity += 1;
        }
      }
    }
    return this.groupedProducts;
  }
}
