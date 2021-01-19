import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientesService } from '@core/service/clientes/clientes.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clientes-edit',
  templateUrl: './clientes-edit.component.html',
  styleUrls: ['./clientes-edit.component.scss'],
})
export class ClientesEditComponent implements OnInit {
  form: FormGroup;
  // tslint:disable-next-line: variable-name
  payer_id: string;

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClientesService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.buildForm();
  }
  // recupero los query que le pase por routerLink, para hacer un request de (1) Cliente
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.payer_id = params.payer_id;
      this.clienteService.getCliente(this.payer_id).subscribe((cliente) => {
        this.form.patchValue(cliente);
      });
    });
  }
  // Construyo el form con sus validaciones
  private buildForm() {
    this.form = this.formBuilder.group({
      payer_id: ['', [Validators.required]],
      given_name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email_address: ['', [Validators.required]],
      address_line: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });
    this.form.get('payer_id').disable();
  }

  // Actualiza info cliente y navega a la lista de clientes
  saveCliente(event: Event) {
    event.preventDefault(); // prevenir el evento por defecto en este caso (Submit)
    if (this.form.valid) {
      const cliente = this.form.value;
      this.clienteService.updateCliente(this.payer_id, cliente).subscribe(() => {
        this.router.navigate(['./admin/clientes']);
      });
    }
  }
}
