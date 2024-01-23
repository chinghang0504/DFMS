import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { ModalService } from './services/modal.service';
import { FileTagsService } from './services/file-tags.service';
import { CommunicationService } from './services/communication.service';
import { finalize } from 'rxjs';
import { SavingPackage } from './models/saving-package';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {

  // UI data
  loading: boolean = true;
  errorMessage: string = '';
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalViewContainerRef: ViewContainerRef;

  // Injection
  constructor(
    private settingsService: SettingsService, private fileTagsService: FileTagsService,
    private communicationService: CommunicationService, private modalService: ModalService
  ) { }

  // On init
  ngOnInit() {
    this.communicationService.httpLoadSaving()
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
        (res: SavingPackage) => {
          this.settingsService.homeFolderPath = res.settingsPackage.homeFolderPath;
          this.settingsService.showHidden = res.settingsPackage.showHidden;
          this.settingsService.removeDoubleConfirmation = res.settingsPackage.removeDoubleConfirmation;

          this.fileTagsService.loadFileTags(res.fileTagsPackage.fileTags);
        }, (err) => {
          this.errorMessage = 'Unable to connect to the desktop. Please make sure that the DFMS.exe is open.';
        }
      );
  }

  // After view init
  ngAfterViewInit() {
    this.modalService.init(this.modalViewContainerRef);
  }
}
