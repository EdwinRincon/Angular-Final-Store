import { Component, AfterViewInit, Inject, Renderer2 } from '@angular/core';
import { ProductsService } from '@core/service/products/products.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';
import { Product } from '@core/models/product.model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements AfterViewInit {

  productos: Product[] = [];
  // QueryParams
  ord: string;
  ascDesc: string;
  like: string;
  limit: number;
  category: string;
  // search
  texto: string;
  // numero total de registros en productos
  nTotalProductos: number;
  // loading message
  showLoadingSpinner = true;

  displayedColumns: string[] = ['name', 'price', 'category', 'actions'];

  constructor(
    private productsService: ProductsService,
    private afs: AngularFireStorage,
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2) {
    this.ascDesc = 'asc';
    this.like = '';
    this.limit = 0;
    this.category = undefined;
  }// inicializo los query para hacer el fetch

  ngAfterViewInit() {
    this.fetchProducts(0); // todos los productos
    this.numeroTotalProductos(); // number
  }
  // N Productos para la paginacion
  numeroTotalProductos() {
    this.productsService.getNRegistrosProduct().subscribe(nTotal => {
      this.nTotalProductos = nTotal;
    });
  }

  paginacion(elementos: number) {
    if (elementos < 9) {
      this.renderer2.setStyle(this.document.getElementById('nextPAdm'), 'display', 'none');
    } else {
      this.renderer2.setStyle(this.document.getElementById('nextPAdm'), 'display', 'block');
    }
    // oculta los botones o los muestra si estan al final del limite de registros
    if (this.limit <= 0) {
      this.renderer2.setStyle(this.document.getElementById('previousPAdm'), 'display', 'none');
    } else {
      this.renderer2.setStyle(this.document.getElementById('previousPAdm'), 'display', 'block');
    }
  }

  fetchProducts(desde: number) {

    // spin mientras carga los datos
    this.showLoadingSpinner = true;
    // desaparece la paginacion mientras cargan  los datos
    this.renderer2.setStyle(this.document.getElementById('nextPAdm'), 'display', 'none');
    this.renderer2.setStyle(this.document.getElementById('previousPAdm'), 'display', 'none');

    this.productsService.getAllProducts(this.ascDesc, this.category, this.like, desde)
      .subscribe(productos => {
        this.showLoadingSpinner = false;
        this.productos = productos;
        this.paginacion(productos.length);
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
          this.limit = 0;
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
      this.limit = 0;
      this.fetchProducts(0);
    } else {
      this.like = '';
      this.limit = 0;
      this.fetchProducts(0);
    }
  }

}
