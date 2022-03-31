import { Component, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { Product } from '@core/models/product.model';
import { ProductsService } from '@core/service/products/products.service';
import { DOCUMENT } from '@angular/common';


import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-products',
  templateUrl: './products.container.html',
  styleUrls: ['./products.container.scss']
})

// tslint:disable-next-line: component-class-suffix
export class ProductsContainer implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Product>;
  panelOpenState = false;
  productos: Product[] = [];
  // QueryParams
  ascDesc: string;
  category: string;
  search: string;
  page: number;
  skip: number;
  // loading message
  showLoadingSpinner = true;
  // paginacion
  pageEvent: PageEvent;


  constructor(private productsService: ProductsService, @Inject(DOCUMENT) private document: Document) {
    this.ascDesc = 'asc';
    this.search = '';
    this.skip = 0;
    this.page = 0;
    this.category = undefined;
  }// inicializo los query para hacer el fetch

  ngAfterViewInit() {
    this.fetchProducts(); // todos los productos
  }

  fetchProducts() {
    // spin mientras carga los datos
    this.showLoadingSpinner = true;
    this.productsService.getAllProducts(this.ascDesc, this.category, this.search, this.page, this.skip)
      .subscribe(productos => {
        this.showLoadingSpinner = false;
        this.dataSource = new MatTableDataSource(productos);
        this.dataSource.paginator = this.paginator;
        this.productos = productos.slice(0, this.skip === 0 ? 6 : this.skip);
      });
    this.toTop();
  }

  getServerData(event?: PageEvent): PageEvent {
    // spin mientras carga los datos
    this.showLoadingSpinner = true;
    this.page = event.pageIndex;
    this.skip = event.pageSize;
    this.productsService.getAllProducts(this.ascDesc, this.category, this.search, this.page, this.skip).subscribe(
      productos => {
        this.showLoadingSpinner = false;
        this.productos = productos.slice(0, this.skip === 0 ? 6 : this.skip);
      }
    );
    return event;
  }

  // Ordenar productos por precio
  sortProductsByPrice() {
    this.productsService.getAllProducts(this.ascDesc, this.category, this.search, this.page, this.skip)
      .subscribe(productos => {
        this.productos = productos.slice(0, this.skip === 0 ? 6 : this.skip);
        this.pageEvent.pageIndex = this.page;
        this.pageEvent.pageSize = this.skip;
      });
  }

  // ordenar productos por categoria
  sortProductsByCategory() {
    if (this.category === 'All') {
      this.category = undefined;
    }
    this.page = 0;
    this.skip = 0;
    this.fetchProducts();
  }

  // filtro de busqueda
  searchFilter() {
    if (this.search.length > 0) {
      this.fetchProducts();
    } else {
      this.search = '';
      this.fetchProducts();
    }
  }

  // flecha que sube al inicio del html
  toTop() {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }
}
