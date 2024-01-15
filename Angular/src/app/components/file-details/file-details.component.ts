import { Component } from '@angular/core';
import { DesktopFile } from '../../models/desktop-file';
import { SystemTagsService } from '../../services/system-tags.service';
import { DesktopCommunicationService } from '../../services/desktop-communication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ErrorPackage } from '../../models/error-package';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrl: './file-details.component.css'
})
export class FileDetailsComponent {

  // UI data
  loading: boolean = true;
  errorMessage: string = '';
  desktopFile: DesktopFile;

  // Injection
  constructor(
    public systemTagsService: SystemTagsService,
    private desktopCommunicationService: DesktopCommunicationService, private modalService: ModalService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  // On init
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      (queryParams) => {
        this.updateData();
      }
    );
  }

  // Update the data
  private updateData() {
    const queryParamsPath: string = this.activatedRoute.snapshot.queryParams['path'];
    if (queryParamsPath) {
      this.loadData(queryParamsPath);
    } else {
      this.router.navigate(['/home']);
    }
  }

  // Load the data
  loadData(path: string) {
    this.loading = true;
    this.errorMessage = '';
    this.desktopFile = null;

    this.desktopCommunicationService.getDesktopFile(path)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(
        (res) => {
          this.desktopFile = res;
        },
        (err) => {
          this.errorMessage = (<ErrorPackage>err['error']).message;
        }
      );
  }

  // On click the back link
  onClickBackLink() {
    if (!this.desktopFile || !this.desktopFile.parentFolderPath) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/home'], {
        queryParams: {
          path: this.desktopFile.parentFolderPath
        }
      });
    }
  }

  // On click to add a tag
  onClickAddTag(tag: string) {
    if (this.checkTag(tag)) {
      const tags: string[] = [...this.desktopFile.tags];
      tags.push(tag);
      tags.sort((a, b) => {
        return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
      });
      this.desktopFile.tags = tags;
    }
  }

  // Check repeated tag
  private checkTag(tag: string): boolean {
    return this.desktopFile.tags.indexOf(tag) === -1;
  }

  // On click the update button
  onClickUpdateButton() {
    this.updateData();
  }

  // On click the save button
  onClickSaveButton() {
    this.modalService.executeTwoButtonModal(
      'Save Confirmation', 'Do you want to save any changes?', 'Save', 'Cancel',
      () => {
        this.saveChanges();
      }
    );
  }

  // Save changes
  private saveChanges() {
    this.desktopCommunicationService.changeDesktopFile(this.desktopFile.absolutePath, this.desktopFile.tags)
      .subscribe(
        () => {
          this.updateData();
        },
        (err) => {
          this.modalService.executeOneButtonModal(
            'Error', this.errorMessage = (<ErrorPackage>err['error']).message, 'OK'
          );
        }
      );
  }

  // On click remove tag
  onClickRemoveTag(tag: string) {
    const index: number = this.desktopFile.tags.indexOf(tag);
    if (index !== -1) {
      this.desktopFile.tags.splice(index, 1);
    }
  }

  // On click the clear button
  onClickClearButton() {
    this.modalService.executeTwoButtonModal(
      'Clear Confirmation', 'Do you want to clear all tags from this file?', 'Clear', 'Cancel',
      () => {
        this.desktopFile.tags = [];
        this.saveChanges();
      }
    );
  }
}
