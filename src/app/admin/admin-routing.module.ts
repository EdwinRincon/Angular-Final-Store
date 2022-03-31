import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavComponent } from './components/nav/nav.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { FormProductComponent } from './components/form-product/form-product.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { ClientesListComponent } from './components/clientes-list/clientes-list.component';
import { ClientesEditComponent } from './components/clientes-edit/clientes-edit.component';
import { FormClienteComponent } from './components/form-cliente/form-cliente.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { OrdersproductoListComponent } from './components/ordersproducto-list/ordersproducto-list.component';
import { OrdersproductoEditComponent } from './components/ordersproducto-edit/ordersproducto-edit.component';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      {
        path: 'productos',
        component: ProductsListComponent
      },
      {
        path: 'productos/create',
        component: FormProductComponent
      },
      {
        path: 'productos/edit/:name',
        component: ProductEditComponent
      },
      {
        path: 'clientes',
        component: ClientesListComponent
      },
      {
        path: 'clientes/edit/:payer_id',
        component: ClientesEditComponent
      },
      {
        path: 'clientes/create',
        component: FormClienteComponent
      },
      {
        path: 'ordenes',
        component: OrdersListComponent
      },
      {
        path: 'ordenesProductos',
        component: OrdersproductoListComponent
      },
      {
        path: 'ordenesProductos/edit/:id_order/:name',
        component: OrdersproductoEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
