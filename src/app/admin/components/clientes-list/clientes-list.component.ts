import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ClientesService } from '@core/service/clientes/clientes.service';
import Swal from 'sweetalert2';
import { Clientes } from '@core/models/clientes.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.scss'],
})
export class ClientesListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'surname',
    'email',
    'address',
    'postalCode',
    'city',
    'actions'
  ];
  dataSource: MatTableDataSource<Clientes>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // QueryParams
  ascDesc: string;
  search: string;
  // loading message
  showLoadingSpinner = true;

  constructor(private clientesService: ClientesService) {
    this.ascDesc = 'asc';
    this.search = '';
  }// inicializo los query para hacer el fetch

  ngAfterViewInit() {
    this.fetchClientes(); // todos los clientes
  }

  // traer array de clientes
  fetchClientes() {
    // spin mientras carga los datos
    this.showLoadingSpinner = true;
    // ascDesc: string, like: string, desde: number
    this.clientesService
      .getAllClientes(this.ascDesc, this.search)
      .subscribe((clientes) => {
        this.showLoadingSpinner = false;
        this.dataSource = new MatTableDataSource(clientes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  deleteCliente(payerId: string) {
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
        this.clientesService.deleteCliente(payerId).subscribe(() => {
          Swal.fire(
            'Eliminado!',
            'El registro se ha eliminado',
            'success'
          );
          this.fetchClientes();
        });
      }
    });
  }

  // filtro de busqueda
  searchFilter() {
    if (this.search.length > 0) {
      this.fetchClientes();
    } else {
      this.search = '';
      this.fetchClientes();
    }
  }
}
