import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MyValidators } from '@utils/validators';
import {AngularFireStorage} from '@angular/fire/storage';
import { ProductsService } from '@core/service/products/products.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.scss']
})
export class FormProductComponent implements OnInit {

  form: FormGroup;
  image$: Observable<any>;

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private storage: AngularFireStorage
  ) {
    this.buildForm();
  }

  ngOnInit() {
  }
  // crea un nuevo producto
  saveProduct(event: Event) {
    event.preventDefault(); // previene Submit por defecto
    if (this.form.valid) {
      const product = this.form.value;
      this.productsService.createProduct(product)
      .subscribe((newProduct) => {
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

  // Creacion del form y sus validaciones
  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, MyValidators.isPriceValid]],
      image: [''],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]]
    });
  }

  // validacion por PIPE
  get priceField() {
    return this.form.get('price');
  }

}
