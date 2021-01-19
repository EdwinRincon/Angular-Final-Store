import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientesService } from '@core/service/clientes/clientes.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.scss']
})
export class FormClienteComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private clientesService: ClientesService,
              private router: Router) { }

  ngOnInit() {
    this.buildForm();
  }

  // crea un nuevo cliente
  saveCliente(event: Event) {
    event.preventDefault(); // previene Submit por defecto
    if (this.form.valid) {
      const cliente = this.form.value;
      this.clientesService.createCliente(cliente)
        .subscribe((newCliente) => {
          this.router.navigate(['./admin/clientes']);
        });
    }
  }

  // Creacion del form y sus validaciones
  private buildForm() {
    this.form = this.formBuilder.group({
      payer_id: ['', [Validators.required]],
      given_name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      email_address: ['', [Validators.required]],
      address_line: ['', [Validators.required]],
      postal_code: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      city: ['', [Validators.required]]
    });
  }

}
