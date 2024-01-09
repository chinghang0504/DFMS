import { Component, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  // Injection
  constructor(private settingsService: SettingsService) { }

  // On init
  ngOnInit() {
    this.settingsService.loadSettings();
  }
}
