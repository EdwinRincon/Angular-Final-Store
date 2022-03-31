import { Component, ViewChild, ElementRef, ErrorHandler, AfterViewInit } from '@angular/core';
import { Product } from '@core/models/product.model';
import { CartService } from '@core/service/cart.service';
import { OrdersService } from '@core/service/orders/orders.service';
import { OrdersproductoService } from '@core/service/ordersproducto/ordersproducto.service';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import Swal from 'sweetalert2';
import { Ordersproducto } from '@core/models/ordersproducto.model';
declare var paypal;


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements AfterViewInit {

  products$: Observable<Product[]>;
  arrayFinal: Product[] = [];
  arrayStorage: Product[];
  public totalAPagar: number;

  constructor(private cartService: CartService,
    private ordersService: OrdersService,
    private ordersproductoService: OrdersproductoService) {
    this.products$ = this.cartService.cart$;
    this.totalAPagar = this.cartService.totalAPagar;
  }
  // btn paypal
  @ViewChild('paypal-button-container', { static: true }) paypalElement: ElementRef;
  // btn subir
  @ViewChild('upButton', { static: true }) upButton: ElementRef;

  ngAfterViewInit() {
    localStorage.clear();
    let totalAPagar = this.totalAPagar;

    // Boton de PAYPAL
    paypal.Buttons({
      style: {
        color: 'blue',
      }, createOrder: (data, actions) => {
        // para poder actualizar el array de productos y el total de dinero a pagar
        // antes de pulsar el boton de paypal y tener los datos correctos
        this.products$.subscribe(arrayToBuy => {
          this.arrayFinal = arrayToBuy;
          this.arrayFinal = this.CartRepeatDelete(this.arrayFinal);
          localStorage.setItem('ordenesProductos', JSON.stringify(this.arrayFinal));
          this.arrayStorage = JSON.parse(localStorage.getItem('ordenesProductos'));
        });
        totalAPagar = this.totalAPagar;
        // This function sets up the details of the transaction, including the amount
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: totalAPagar
            }
          }
          ]
        });
      },
      onApprove: async (data, actions) => {
        actions.order.capture().then(async (details) => {
          // si el pago es aprobado, se intentará guardar en la BBDD los datos del cliente
          return fetch(`${environment.url_api}/clientes`, {
            method: 'post',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              payer_id: details.payer.payer_id,
              given_name: details.payer.name.given_name,
              surname: details.payer.name.surname,
              email_address: details.payer.email_address,
              address_line: details.purchase_units[0].shipping.address.address_line_1,
              postal_code: details.purchase_units[0].shipping.address.postal_code,
              city: details.purchase_units[0].shipping.address.admin_area_1
            })
          }).then(async (responseCliente) => {
            // si los datos del cliente se han guardado, entonces se guardarán los datos de la orden            
            if (responseCliente.ok) {
              let createTime: string;
              createTime = details.purchase_units[0].payments.captures[0].create_time;
              const order = {
                id_order: details.id,
                payer_id: details.payer.payer_id,
                create_time: createTime.slice(0, 10)
              }
              try {
                await this.ordersService.createOrder(order).toPromise();
                let ordenesProductos: Ordersproducto;
                for (let index = 0; index < this.arrayStorage.length; index++) {
                  ordenesProductos = {
                    name: this.arrayStorage[index].name,
                    id_order: details.id,
                    payer_id: details.payer.payer_id,
                    cantidad: this.arrayStorage[index].quantity
                  }
                  await this.ordersproductoService.createOrdersProducto(ordenesProductos).toPromise();
                }
                Swal.fire({
                  title: 'Compra Recibida!',
                  html: 'Deseamos volver a verte! ' + details.payer.name.given_name +
                    '<br></br>Guarda tu codigo de orden<br></br>' + details.id,
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                });
              } catch (error) {
                Swal.fire({
                  title: 'Error!',
                  html: error,
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
                });
              }
              // Mensaje de error sino se ha podido guadar en la BBDD el cliente
            } else {
              Swal.fire({
                title: 'Error!',
                html: 'Tus datos no se han podido guardar, tu orden ha sido cancelada, por favor intentalo de nuevo',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          });
        });
        localStorage.clear();
      }, // error por parte de PAYPAL
      onError: (error: ErrorHandler) => {
        // Limpiar datos locales
        localStorage.clear();
        Swal.fire({
          title: 'Oops!',
          text: 'Lo sentimos ha habido un error, Intentalo mas tarde',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      }
    }).render('#paypal-button-container');
    // This function displays Smart Payment Buttons on your web page.
  }

  // agrega un producto al array
  addProduct(product: Product) {
    this.cartService.addCart(product);
  }

  // eliminar un producto del array
  async deleteProduct(product: Product) {
    this.totalAPagar = await this.cartService.deleteCart(product);
  }

  // flecha que sube al inicio del html
  toTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }


  // Elimina los productos repetidos para guardar en la BBDD
  CartRepeatDelete(value: Product[]): Product[] {
    const productosTransformar: Product[] = [];
    let p: any;

    for (const iterator of value) {
      if (productosTransformar.length === 0) {
        productosTransformar.push(Object.assign(iterator, { quantity: 1 }));
      } else {
        if (!productosTransformar.find((p = (z) => z.name === iterator.name))) {
          productosTransformar.push(Object.assign(iterator, { quantity: 1 }));
        } else {
          const repeatedProducts = productosTransformar.findIndex(p);
          productosTransformar[repeatedProducts].quantity += 1;
        }
      }
    }
    return productosTransformar;
  }
}
