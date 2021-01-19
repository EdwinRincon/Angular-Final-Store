import { Component, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OrdersService } from '@core/service/orders/orders.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements AfterViewInit {

  orders = [];

  // QueryParams
  ord: string;
  ascDesc: number;
  like: string;
  limit: number;
  // search
  texto: string;
  // numero totla de registros en clientes
  nTotalOrders: number;
    // loading message
    showLoadingSpinner = true;

  displayedColumns: string[] = ['id_order', 'payer_id', 'create_time', 'actions'];

  constructor(private ordersService: OrdersService,
              private renderer2: Renderer2,
              @Inject(DOCUMENT) private document: Document) {
    this.ord = 'payer_id';
    this.ascDesc = 0;
    this.like = null;
    this.limit = 0;
}// inicializo los query para hacer el fetch

  ngAfterViewInit() {
    this.fetchOrders(0); // todas las ordenes
    this.numeroTotalOrders(); // number
  }
  // N Ordenes para la paginacion
  numeroTotalOrders() {
    this.ordersService.getNRegistrosOrders().subscribe(nTotal => {
      this.nTotalOrders = nTotal;
    });
  }

  paginacion(elementos: number) {
    if (elementos < 9) {
    this.renderer2.setStyle(this.document.getElementById('nextO'), 'display', 'none');
    } else {
    this.renderer2.setStyle(this.document.getElementById('nextO'), 'display', 'block');
    }
    // oculta los botones o los muestra si estan al final del limite de registros
    if (this.limit <= 0) {
      this.renderer2.setStyle(this.document.getElementById('previousO'), 'display', 'none');
    } else {
      this.renderer2.setStyle(this.document.getElementById('previousO'), 'display', 'block');
    }
  }
  // traer array de orders
  fetchOrders(limit: number) {
    this.limit += limit;

    // spin mientras carga los datos
    this.showLoadingSpinner = true;
    // desaparece la paginacion mientras cargan  los datos
    this.renderer2.setStyle(this.document.getElementById('nextO'), 'display', 'none');
    this.renderer2.setStyle(this.document.getElementById('previousO'), 'display', 'none');

    this.ordersService.getAllOrders(this.ord, this.ascDesc, this.like, this.limit)
    .subscribe(orders => {
      this.showLoadingSpinner = false;
      this.orders = orders;
      this.paginacion(orders.length);
    });
  }

  deleteOrder(idOrder: string) {
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
      // si confirma hace request a eliminar la orden
      if (result.value) {
        this.ordersService.deleteOrder(idOrder).subscribe(() => {
          Swal.fire(
            'Eliminado!',
            'El registro se ha eliminado',
            'success'
          );
          this.limit = 0;
          this.fetchOrders(0);
        });
      }
    });
  }
  // filtro de busqueda
  search() {
    if (this.texto.length > 0) {
      this.like = this.texto;
      this.limit = 0;
      this.fetchOrders(0);
    } else {
      this.like = null;
      this.limit = 0;
      this.fetchOrders(0);
    }
  }

}
