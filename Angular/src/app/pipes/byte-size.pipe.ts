import { Pipe, PipeTransform } from '@angular/core';
import { DesktopFile } from '../models/desktop-file';

@Pipe({
  name: 'byteSize'
})
export class ByteSizePipe implements PipeTransform {

  transform(desktopFile: DesktopFile): string {
    if (desktopFile.isFolder) {
      return '';
    }
    else {
      return Math.ceil(desktopFile.size / 1024) + ' KB';
    }
  }
}