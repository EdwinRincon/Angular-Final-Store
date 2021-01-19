import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MyValidators } from '@utils/validators';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { ProductsService } from '@core/service/products/products.service';
import { Observable } from 'rxjs';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  form: FormGroup;
  name: string;
  image$: Observable<any>;
  available: boolean;
  category = undefined;
  color: ThemePalette = 'primary';

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage
  ) {
    this.buildForm();
  }
  // recupero los query que le pase por routerLink, para hacer un request de (1) Producto
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.name = params.name;
      this.productsService.getProduct(this.name)
        .subscribe(product => {
          this.form.patchValue(product);
          this.available = product.available;
        });
    });
  }

  cambio() {
    this.available ? this.available = false : this.available = true;
  }
  // Actualiza info cliente y navega a la lista de productos
  saveProduct(event: Event) {
    event.preventDefault(); // prevenir el evento por defecto en este caso (Submit)
    if (this.form.valid) {
      const product = this.form.value;
      this.productsService.updateProduct(this.name, product).subscribe(() => {
        this.router.navigate(['./admin/productos']);
      });
    }
  }

  // Guarda en Firebase Storage la imagen del producto
  // con el nombre del titulo que tenga
  uploadFile(event) {
    const file = event.target.files[0];
    const dir = this.form.value.title;
    const fileRef = this.storage.ref(dir);
    const task = this.storage.upload(dir, file);

    // consigo la URL de la imagen para guardar en la BBDD
    // con sus demas datos...
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          this.image$ = fileRef.getDownloadURL();
          this.image$.subscribe(url => {
            this.form.get('image').setValue(url);
          });
        })
      )
      .subscribe();
  }

  // Construyo el form con sus validaciones
  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, MyValidators.isPriceValid]],
      img: [''],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      available: ['']
    });
  }

  // validacion por PIPE
  get priceField() {
    return this.form.get('price');
  }

}
