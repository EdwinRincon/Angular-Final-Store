import { Component, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { Product } from '@core/models/product.model';
import { ProductsService } from '@core/service/products/products.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './products.container.html',
  styleUrls: ['./products.container.scss']
})

// tslint:disable-next-line: component-class-suffix
export class ProductsContainer implements AfterViewInit {
  panelOpenState = false;
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


  constructor(private productsService: ProductsService,
              @Inject(DOCUMENT) private document: Document,
              private renderer2: Renderer2) {
    this.ascDesc = 'asc';
    this.like = '';
    this.limit = 0;
    this.category = undefined;
  }// inicializo los query para hacer el fetch

  ngAfterViewInit() {
    this.fetchProducts(0); // todos los productos
    this.numeroTotalProductos();  // number
  }
  // N Productos para la paginacion
  numeroTotalProductos() {
    this.productsService.getNRegistrosProduct().subscribe(nTotal => {
      this.nTotalProductos = nTotal;
    });
  }

  paginacion(elementos: number) {
    if (elementos < 9) {
    this.renderer2.setStyle(this.document.getElementById('nextP'), 'display', 'none');
    } else {
    this.renderer2.setStyle(this.document.getElementById('nextP'), 'display', 'block');
    }
    // oculta los botones o los muestra si estan al final del limite de registros
    if (this.limit <= 0) {
      this.renderer2.setStyle(this.document.getElementById('previousP'), 'display', 'none');
    } else {
      this.renderer2.setStyle(this.document.getElementById('previousP'), 'display', 'block');
    }
  }

  fetchProducts(desde: number) {

    // spin mientras carga los datos
    this.showLoadingSpinner = true;
    // desaparece la paginacion mientras cargan  los datos
    this.renderer2.setStyle(this.document.getElementById('nextP'), 'display', 'none');
    this.renderer2.setStyle(this.document.getElementById('previousP'), 'display', 'none');
    this.productsService.getAllProducts(this.ascDesc, this.category, this.like, desde)
      .subscribe(productos => {
        this.showLoadingSpinner = false;
        this.productos = productos;
        this.paginacion(productos.length);
      });
    this.toTop();
  }

  // Ordenar productos por precio
  sortProductsByPrice() {
    this.productsService.getAllProducts(this.ascDesc, this.category, this.like, 0)
      .subscribe(productos => {
        this.productos = productos;
      });
  }

  // ordenar productos por categoria
  sortProductsByCategory() {
    if (this.category === 'All') {
      this.category = undefined;
    }
    this.fetchProducts(0);
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

  // flecha que sube al inicio del html
  toTop() {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }
}
