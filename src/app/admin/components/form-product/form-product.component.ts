import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyValidators } from '@utils/validators';
import { AngularFireStorage } from '@angular/fire/storage';
import { ProductsService } from '@core/service/products/products.service';
import { finalize } from 'rxjs/internal/operators/finalize';


@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.scss']
})
export class FormProductComponent implements OnInit {

  form: FormGroup;
  category = undefined;
  file: File;
  url = '';

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private storage: AngularFireStorage
  ) {
    this.buildForm();
  }

  ngOnInit() { }


  // crea un nuevo producto
  saveProduct(event: Event) {
    event.preventDefault(); // previene Submit por defecto
    if (this.form.valid) {
      this.form.value.image = this.url;
      const product = this.form.value;

      // Guarda en Firebase Storage la imagen del producto

      const filePath = this.form.value.name;
      const fileRef = this.storage.ref('images/' + filePath);
      const task = this.storage.upload('images/' + filePath, this.file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.form.get('image').setValue(url);
          });
        }));

      this.productsService.createProduct(product).subscribe(() => {
        this.router.navigate(['./admin/productos']);
      });
    }
  }

  uploadFile(event) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (e) => {
      this.url = e.target.result.toString();
    };
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
