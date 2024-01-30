import { Component, Input } from '@angular/core';
import { DesktopFile } from '../../../models/desktop-file.model';

@Component({
  selector: 'app-file-details-table',
  templateUrl: './file-details-table.component.html',
  styleUrl: './file-details-table.component.css'
})
export class FileDetailsTableComponent {

  @Input() desktopFile: DesktopFile;
}
