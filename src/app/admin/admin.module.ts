import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from './../material/material.module';
import { NavComponent } from './components/nav/nav.component';

import { ProductsListComponent } from './components/products-list/products-list.component';
import { FormProductComponent } from './components/form-product/form-product.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { ClientesListComponent } from './components/clientes-list/clientes-list.component';
import { ClientesEditComponent } from './components/clientes-edit/clientes-edit.component';
import { FormClienteComponent } from './components/form-cliente/form-cliente.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { SharedModule } from '@shared/shared.module';
import { OrdersproductoListComponent } from './components/ordersproducto-list/ordersproducto-list.component';
import { OrdersproductoEditComponent } from './components/ordersproducto-edit/ordersproducto-edit.component';

@NgModule({
  declarations: [
    NavComponent,
    ProductsListComponent,
    FormProductComponent,
    ProductEditComponent,
    ClientesListComponent,
    ClientesEditComponent,
    FormClienteComponent,
    OrdersListComponent,
    OrdersproductoListComponent,
    OrdersproductoEditComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    SharedModule
  ]
})
export class AdminModule { }
