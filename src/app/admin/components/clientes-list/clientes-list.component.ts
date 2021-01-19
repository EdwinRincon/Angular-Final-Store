import { Component, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { ClientesService } from '@core/service/clientes/clientes.service';
import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.scss'],
})
export class ClientesListComponent implements AfterViewInit {
  clientes = [];

  // QueryParams
  ord: string;
  ascDesc: number;
  like: string;
  limit: number;
  // search
  texto: string;
  // numero total de registros en clientes
  nTotalClientes: number;
  // loading message
  showLoadingSpinner = true;

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


  constructor(private clientesService: ClientesService,
              private renderer2: Renderer2,
              @Inject(DOCUMENT) private document: Document) {
    this.ord = 'city';
    this.ascDesc = 0;
    this.like = null;
    this.limit = 0;
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

  paginacion(elementos: number) {
    if (elementos < 9) {
    this.renderer2.setStyle(this.document.getElementById('nextC'), 'display', 'none');
    } else {
    this.renderer2.setStyle(this.document.getElementById('nextC'), 'display', 'block');
    }
    // oculta los botones o los muestra si estan al final del limite de registros
    if (this.limit <= 0) {
      this.renderer2.setStyle(this.document.getElementById('previousC'), 'display', 'none');
    } else {
      this.renderer2.setStyle(this.document.getElementById('previousC'), 'display', 'block');
    }
  }

  // traer array de clientes
  fetchClientes(limit: number) {
    this.limit += limit;

    // spin mientras carga los datos
    this.showLoadingSpinner = true;
    // desaparece la paginacion mientras cargan  los datos
    this.renderer2.setStyle(this.document.getElementById('nextC'), 'display', 'none');
    this.renderer2.setStyle(this.document.getElementById('previousC'), 'display', 'none');

    this.clientesService
      .getAllClientes(this.ord, this.ascDesc, this.like, this.limit)
      .subscribe((clientes) => {
        this.showLoadingSpinner = false;
        this.clientes = clientes;
        this.paginacion(clientes.length);
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
        this.clientesService.deleteCliente(payerId).subscribe(() =>  {
          Swal.fire(
            'Eliminado!',
            'El registro se ha eliminado',
            'success'
          );
          this.limit = 0;
          this.fetchClientes(0);
        });
      }
    });
  }

  // filtro de busqueda
  search() {
    if (this.texto.length > 0) {
      this.like = this.texto;
      this.limit = 0;
      this.fetchClientes(0);
    } else {
      this.like = null;
      this.limit = 0;
      this.fetchClientes(0);
    }
  }
}
