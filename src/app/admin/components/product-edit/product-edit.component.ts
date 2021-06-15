import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MyValidators } from '@utils/validators';
import { AngularFireStorage } from '@angular/fire/storage';
import { ProductsService } from '@core/service/products/products.service';
import { finalize } from 'rxjs/operators';
import { Product } from '@core/models/product.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  form: FormGroup;
  name: string;
  available: boolean;
  category = undefined;
  url = '';

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
      this.productsService.getProduct(this.name).subscribe(product => {
        this.form.patchValue(product);
        this.available = product.available;
      });
    });
  }

  cambio() {
    this.available ? this.available = false : this.available = true;
  }
  // Actualiza info cliente y navega a la lista de productos
  async saveProduct(event) {
    event.preventDefault(); // prevenir el evento por defecto en este caso (Submit)
    if (this.form.valid) {
      let product: Product = this.form.value;

      try {
        const file = event.target.files[0];
        // Guarda en Firebase Storage la imagen del producto
        const filePath = this.form.value.name;
        const fileRef = this.storage.ref('images/' + filePath);
        const task = this.storage.upload('images/' + filePath, file);

        task.snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(url => {
                this.form.get('image').setValue(url);
                product = this.form.value;
                this.productsService.updateProduct(this.name, product).subscribe(() => {
                  this.router.navigate(['./admin/productos']);
                });
              });
            })
          )
          .subscribe();

      } catch (error) {
        // Si hay error, es porque no se ha subido una nueva imagen.
        // Enviamos el producto actualizado con la imagen que tenia antes
        this.productsService.updateProduct(this.name, product).subscribe(() => {
          this.router.navigate(['./admin/productos']);
        });
      }



    }
  }


  uploadFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      this.url = e.target.result.toString();
    };
  }

  // Construyo el form con sus validaciones
  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, MyValidators.isPriceValid]],
      image: [''],
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
