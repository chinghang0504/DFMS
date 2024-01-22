import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { ModalService } from './services/modal.service';
import { FileTagsService } from './services/file-tags.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {

  // UI data
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalViewContainerRef: ViewContainerRef;

  // Injection
  constructor(public settingsService: SettingsService, private fileTagsService: FileTagsService, private modalService: ModalService) { }

  // On init
  ngOnInit() {
    this.settingsService.loadSettings();
    this.fileTagsService.loadFileTags();
  }

  // After view init
  ngAfterViewInit() {
    this.modalService.init(this.modalViewContainerRef);
  }
}
