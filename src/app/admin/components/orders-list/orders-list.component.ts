import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { OrdersService } from '@core/service/orders/orders.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Orders } from '@core/models/orders.model';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements AfterViewInit {

  displayedColumns: string[] = ['id_order', 'payer_id', 'create_time', 'actions'];
  dataSource: MatTableDataSource<Orders>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // QueryParams
  search: string;
  // loading message
  showLoadingSpinner = true;


  constructor(private ordersService: OrdersService) {
    this.search = '';
  }

  ngAfterViewInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    // spin mientras carga los datos
    this.showLoadingSpinner = true;
    this.ordersService.getAllOrders(this.search)
      .subscribe(ordenes => {
        this.showLoadingSpinner = false;
        this.dataSource = new MatTableDataSource(ordenes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
          this.fetchOrders();
        });
      }
    });
  }

  // filtro de busqueda
  searchFilter() {
    if (this.search.length > 0) {
      this.fetchOrders();
    } else {
      this.search = '';
      this.fetchOrders();
    }
  }

}
