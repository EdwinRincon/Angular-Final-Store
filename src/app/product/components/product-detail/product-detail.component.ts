import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProductsService } from '@core/service/products/products.service';
import { Product } from '@core/models/product.model';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  product$: Observable<Product>;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

  // por query recoge el ID de producto para hacer request de (1) producto
  ngOnInit() {
    this.product$ = this.route.params.pipe(switchMap((params: Params) => {
        return this.productsService.getProduct(params.name);
      }));
  }

}
