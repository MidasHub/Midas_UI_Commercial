import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
  }

}
