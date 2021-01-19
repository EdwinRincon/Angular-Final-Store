import { Pipe, PipeTransform } from '@angular/core';

// los @ son decoradores
@Pipe({
  name: 'exponential'
})
export class ExponentialPipe implements PipeTransform {

  transform(value: number): any {
    return Math.pow(value, 2);
  }

}
