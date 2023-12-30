import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteSize'
})
export class ByteSizePipe implements PipeTransform {

  transform(value: number): string {
    return value ? Math.ceil(value / 1024) + ' KB' : '';
  }
}
