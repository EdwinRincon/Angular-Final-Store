/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrdersproductoService } from './ordersproducto.service';

describe('Service: Ordersproducto', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdersproductoService]
    });
  });

  it('should ...', inject([OrdersproductoService], (service: OrdersproductoService) => {
    expect(service).toBeTruthy();
  }));
});
