import {AbstractControl} from '@angular/forms';

export class MyValidators {
    // pipe que se utilizará para que no pase de 10.000 €
    // los productos al crearlos o editarlos
    static isPriceValid(control: AbstractControl) {
        const value = control.value;
        if (value > 10000 || value <= 0) {
            return {price_invalid: true};
        }
        return null;
    }
}
