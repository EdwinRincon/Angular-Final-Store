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
  ord: string;
  ascDesc: string;
  like: string;
  category: string;
  // search
  texto: string;
  // numero total de registros en productos
  nTotalClientes: number;
  // loading message
  showLoadingSpinner = true;

  


  constructor(private clientesService: ClientesService) {
    this.ascDesc = 'asc';
    this.like = null;
  }// inicializo los query para hacer el fetch

  ngAfterViewInit() {
    this.fetchClientes(0); // todos los clientes
    this.numeroTotalClientes(); // number
  }

  // N Clientes para la paginacion
  numeroTotalClientes() {
    this.clientesService.getNRegistrosCliente().subscribe(nTotal => {
      this.nTotalClientes = nTotal;
    });
  }

  // traer array de clientes
  fetchClientes(desde: number) {

    // spin mientras carga los datos
    this.showLoadingSpinner = true;
    // ascDesc: string, like: string, desde: number
    this.clientesService
      .getAllClientes(this.ascDesc, this.like, desde)
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
          this.fetchClientes(0);
        });
      }
    });
  }

  // filtro de busqueda
  search() {
    if (this.texto.length > 0) {
      this.like = this.texto;
      this.fetchClientes(0);
    } else {
      this.like = null;
      this.fetchClientes(0);
    }
  }
}
