import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tags'
})
export class TagsPipe implements PipeTransform {

  transform(tags: string[]): string {
    if (tags.length === 0) {
      return 'No tags';
    } else {
      let str: string = `Tags: ${tags[0]}`;
      for (let i = 1; i < tags.length; i++) {
        str += `, ${tags[i]}`;
      }
      return str;
    }
  }
}
