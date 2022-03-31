import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { OrdersproductoService } from '@core/service/ordersproducto/ordersproducto.service';
import Swal from 'sweetalert2';
import {Ordersproducto} from '@core/models/ordersproducto.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-ordersproducto-list',
  templateUrl: './ordersproducto-list.component.html',
  styleUrls: ['./ordersproducto-list.component.scss']
})
export class OrdersproductoListComponent implements AfterViewInit {

  displayedColumns: string[] = ['id_order', 'payer_id', 'name', 'cantidad', 'actions'];
  dataSource: MatTableDataSource<Ordersproducto>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // QueryParams
  ascDesc: string;
  search: string;
  // loading message
  showLoadingSpinner = true;

  constructor(private ordersproductoService: OrdersproductoService) {
    this.ascDesc = 'asc';
    this.search = '';
  }

  ngAfterViewInit() {
    this.fetchOrdersProducto(); // todos los ordersproducto
  }

  // traer array de ordersproducto
  fetchOrdersProducto() {
    // spin mientras carga los datos
    this.showLoadingSpinner = true;
    this.ordersproductoService.getAllOrdersProducto(this.ascDesc, this.search)
      .subscribe(ordersproducto => {
        this.showLoadingSpinner = false;
        this.dataSource = new MatTableDataSource(ordersproducto);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }


  deleteOrdersProducto(idOrder: string, name: string) {
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
        this.ordersproductoService.deleteOrdersProducto(idOrder, name)
          .subscribe(rta => {
            Swal.fire(
              'Eliminado!',
              'El registro se ha eliminado',
              'success'
            );
            this.fetchOrdersProducto();
          });
      }
    });
  }

    // filtro de busqueda
    searchFilter() {
      if (this.search.length > 0) {
        this.fetchOrdersProducto();
      } else {
        this.search = '';
        this.fetchOrdersProducto();
      }
    }

}
