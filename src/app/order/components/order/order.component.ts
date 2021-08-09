import { Component, ViewChild, ElementRef, ErrorHandler, AfterViewInit } from '@angular/core';
import { Product } from '@core/models/product.model';
import { CartService } from '@core/service/cart.service';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import Swal from 'sweetalert2';
declare var paypal;


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements AfterViewInit {

  products$: Observable<Product[]>;
  arrayFinal: Product[] = [];
  public totalAPagar: number;

  constructor(private cartService: CartService) {
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
    let arrayStorage: Product[];
    // para poder actualizar el array de productos y el total de dinero a pagar
    // antes de pulsar el boton de paypal y tener los datos correctos
    document.getElementById('capsula').addEventListener('mouseenter', () => {
      this.products$.subscribe(arrayToBuy => {
        this.arrayFinal = arrayToBuy;
        this.arrayFinal = this.CartRepeatDelete(this.arrayFinal);
        localStorage.setItem('ordersproducto', JSON.stringify(this.arrayFinal));
        arrayStorage = JSON.parse(localStorage.getItem('ordersproducto'));
      });
      totalAPagar = this.totalAPagar;
    });
    // Boton de PAYPAL
    paypal.Buttons({
      style: {
        color: 'blue',
      }, createOrder: (data, actions) => {
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
              try {
                const responseOrder = await fetch(`${environment.url_api}/orders`, {
                  method: 'post',
                  headers: {
                    'content-type': 'application/json'
                  },
                  body: JSON.stringify({
                    id_order: details.id,
                    payer_id: details.payer.payer_id,
                    create_time: createTime.slice(0, 10)
                  })
                });
                if (responseOrder.ok) {
                  Swal.fire({
                    title: 'Compra Recibida!',
                    html: 'Deseamos volver a verte! ' + details.payer.name.given_name +
                      '<br></br>Guarda tu codigo de orden<br></br>' + details.id,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                  });
                  // Guardar los productos comprados con su cantidad e ID de orden
                  // tslint:disable-next-line: prefer-for-of
                  for (let index = 0; index < arrayStorage.length; index++) {
                    await fetch(`${environment.url_api}/ordersproducto`, {
                      method: 'post',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify({
                        id_order: details.id,
                        payer_id: details.payer.payer_id,
                        cantidad: arrayStorage[index].quantity
                      })
                    });
                  }
                }
              } catch (error) {
                Swal.fire({
                  title: 'Error!',
                  html: '<br></br>Ha habido un problema,<br></br>' +
                    'ponte en Contacto para terminar tu compra<br></br>' +
                    'recuerda que hemos recibido ya tu pago.',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
                });
              }
              // Mensaje de error sino se ha podido guadar en la BBDD el cliente
            } else {
              Swal.fire({
                title: 'Error!',
                html: 'backend status: ' + responseCliente.status,
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
