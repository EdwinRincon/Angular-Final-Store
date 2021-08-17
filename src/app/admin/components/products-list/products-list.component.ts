import { Component, AfterViewInit, Inject, Renderer2, ViewChild } from '@angular/core';
import { ProductsService } from '@core/service/products/products.service';
import { AngularFireStorage } from '@angular/fire/storage';
import Swal from 'sweetalert2';
import { Product } from '@core/models/product.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'price', 'category', 'actions'];
  dataSource: MatTableDataSource<Product>;
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
  nTotalProductos: number;
  // loading message
  showLoadingSpinner = true;


  constructor(
    private productsService: ProductsService,
    private afs: AngularFireStorage) {
    this.ascDesc = 'asc';
    this.like = '';
    this.category = undefined;
  }// inicializo los query para hacer el fetch

  ngAfterViewInit() {
    this.fetchProducts(0); // todos los productos
    this.numeroTotalProductos(); // number
  }

  fetchProducts(desde: number) {

    // spin mientras carga los datos
    this.showLoadingSpinner = true;
    this.productsService.getAllProducts(this.ascDesc, this.category, this.like, desde)
      .subscribe(productos => {
        this.showLoadingSpinner = false;
        this.dataSource = new MatTableDataSource(productos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  // N Productos para la paginacion
  numeroTotalProductos() {
    this.productsService.getNRegistrosProduct().subscribe(nTotal => {
      this.nTotalProductos = nTotal;
    });
  }

  deleteProduct(name: string) {
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
      // si confirma hace request a eliminar el producto
      if (result.value) {
        this.productsService.deleteProduct(name).subscribe(() => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          });
          Toast.fire({
            icon: 'success',
            title: 'Producto eliminado'
          });
          this.fetchProducts(0);
          this.afs.ref('images/' + name).delete().toPromise().then(() => {
            // File deleted successfully
            console.log('IMAGEN ELIMINADA');
          }).catch((error) => {
            // Uh-oh, an error occurred!
            console.log('error', error.message);
          });

        });
      }
    });
  }

  // filtro de busqueda
  search() {
    if (this.texto.length > 0) {
      this.like = this.texto;
      this.fetchProducts(0);
    } else {
      this.like = '';
      this.fetchProducts(0);
    }
  }
}
