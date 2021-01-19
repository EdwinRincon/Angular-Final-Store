import { Component, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OrdersproductoService } from '@core/service/ordersproducto/ordersproducto.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-ordersproducto-list',
  templateUrl: './ordersproducto-list.component.html',
  styleUrls: ['./ordersproducto-list.component.scss']
})
export class OrdersproductoListComponent implements AfterViewInit {

  ordersProducto = [];

  // QueryParams
  ord: string;
  ascDesc: number;
  like: string;
  limit: number;
  // search
  texto: string;
  // numero totla de registros en clientes
  nTotalOrdersProducto: number;
  // loading message
  showLoadingSpinner = true;

  displayedColumns: string[] = ['id_order', 'payer_id', 'idProduct', 'cantidad', 'actions'];

  constructor(private ordersproductoService: OrdersproductoService,
              @Inject(DOCUMENT) private document: Document,
              private renderer2: Renderer2 ) {
                this.ord = null;
                this.ascDesc = 0;
                this.like = null;
                this.limit = 0;
}// inicializo los query para hacer el fetch

  ngAfterViewInit() {
    this.fetchOrdersProducto(0); // todos los ordersproducto
    this.numeroTotalOrdersProducto(); // number
  }
  // N OrdersProducto para la paginacion
  numeroTotalOrdersProducto() {
    this.ordersproductoService.getNRegistrosOrdesProducto()
    .subscribe(nTotal => {
      this.nTotalOrdersProducto = nTotal;
    });
  }

  paginacion(elementos: number) {
    if (elementos < 9) {
      this.renderer2.setStyle(this.document.getElementById('nextOP'), 'display', 'none');
    } else {
      this.renderer2.setStyle(this.document.getElementById('nextOP'), 'display', 'block');
    }
    // oculta los botones o los muestra si estan al final del limite de registros
    if (this.limit <= 0) {
      this.renderer2.setStyle(this.document.getElementById('previousOP'), 'display', 'none');
    } else {
      this.renderer2.setStyle(this.document.getElementById('previousOP'), 'display', 'block');
    }
  }

  // traer array de ordersproducto
  fetchOrdersProducto(limit: number) {
    this.limit += limit;

    // spin mientras carga los datos
    this.showLoadingSpinner = true;
    // desaparece la paginacion mientras cargan  los datos
    this.renderer2.setStyle(this.document.getElementById('nextOP'), 'display', 'none');
    this.renderer2.setStyle(this.document.getElementById('previousOP'), 'display', 'none');

    this.ordersproductoService.getAllOrdersProducto(this.ord, this.ascDesc, this.like, this.limit)
    .subscribe(ordersproducto => {
      this.showLoadingSpinner = false;
      this.ordersProducto = ordersproducto;
      this.paginacion(ordersproducto.length);
    });
  }


  deleteOrdersProducto(idOrder: string, idProduct: string) {
    // pregunta primero si está seguro de eliminar
    Swal.fire({
      title: 'Estás seguro?',
      text: 'No podrás revertir la acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, Eliminar!'
    }).then((result) => {
       // si confirma hace request a eliminar el cliente
      if (result.value) {
        this.ordersproductoService.deleteOrdersProducto(idOrder, idProduct)
        .subscribe(rta => {
          Swal.fire(
            'Eliminado!',
            'El registro se ha eliminado',
            'success'
          );
          this.limit = 0;
          this.fetchOrdersProducto(0);
        });
      }
    });
  }

  // filtro de busqueda
  search() {
    if (this.texto.length > 0) {
      this.like = this.texto;
      this.limit = 0;
      this.fetchOrdersProducto(0);
    } else {
      this.like = null;
      this.limit = 0;
      this.fetchOrdersProducto(0);
    }
  }

}
