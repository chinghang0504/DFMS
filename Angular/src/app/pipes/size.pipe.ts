import { Pipe, PipeTransform } from '@angular/core';
import { DesktopFile } from '../models/desktop-file.model';

@Pipe({
  name: 'size'
})
export class SizePipe implements PipeTransform {

  transform(desktopFile: DesktopFile): string {
    if (desktopFile.isFolder) {
      return '';
    }
    else {
      return Math.ceil(desktopFile.size / 1024) + ' KB';
    }
  }
}
