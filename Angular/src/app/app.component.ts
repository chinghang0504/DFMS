import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { ModalService } from './services/modal.service';
import { SystemTagsService } from './services/system-tags.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {

  // UI data
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalViewContainerRef: ViewContainerRef;

  // Injection
  constructor(private modalService: ModalService, private settingsService: SettingsService, private systemTagsService: SystemTagsService) { }

  // On init
  ngOnInit() {
    this.settingsService.loadSettings();
    this.systemTagsService.loadTags();
  }

  // After view init
  ngAfterViewInit() {
    this.modalService.init(this.modalViewContainerRef);
  }
}