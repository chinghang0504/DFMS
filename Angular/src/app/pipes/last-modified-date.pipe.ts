
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastModifiedDate'
})
export class LastModifiedDatePipe implements PipeTransform {

  // Injection
  constructor(private datePipe: DatePipe) { }

  transform(lastModified: number): string {
    return this.datePipe.transform(lastModified, 'yyyy/MM/dd/ hh:mm');
  }
}
