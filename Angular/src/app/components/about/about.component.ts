import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  // Public data
  version: string = '1.0.1';
  releaseDate: string = '2024/01/31';
}
