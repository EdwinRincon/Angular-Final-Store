import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OrdersproductoService } from '@core/service/ordersproducto/ordersproducto.service';
@Component({
  selector: 'app-ordersproducto-edit',
  templateUrl: './ordersproducto-edit.component.html',
  styleUrls: ['./ordersproducto-edit.component.scss']
})
export class OrdersproductoEditComponent implements OnInit {

  form: FormGroup;
  // tslint:disable-next-line: variable-name
  id_order: string;
  name: string; // nombre del producto

  constructor(private formBuilder: FormBuilder,
    private ordersproductoService: OrdersproductoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.buildForm();
  }

  // recupero los query que le pase por routerLink, para hacer un request de (1)
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id_order = params.id_order;
      this.name = params.name;
      this.ordersproductoService.getOrdersProducto(this.id_order, this.name).subscribe((orderproducto) => {
        this.form.patchValue(orderproducto);
      });
    });
  }

  // Construyo el form con sus validaciones
  private buildForm() {
    this.form = this.formBuilder.group({
      id_order: ['', [Validators.required]],
      payer_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.maxLength(3)]]
    });
    this.form.get('id_order').disable();
    this.form.get('payer_id').disable();
  }

  saveOrderProducto(event: Event) {
    event.preventDefault(); // prevenir el evento por defecto en este caso (Submit)
    if (this.form.valid) {
      this.form.get('id_order').enable();
      this.form.get('payer_id').enable();
      const orderproducto = this.form.value;
      this.ordersproductoService.updateOrdersProducto(this.id_order, this.name, orderproducto).subscribe(() => {
        this.router.navigate(['./admin/ordenesProductos']);
      });
    }
  }

}
