import { ChangeDetectorRef, Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-one-button-modal',
  templateUrl: './one-button-modal.component.html',
  styleUrl: './one-button-modal.component.css'
})
export class OneButtonModalComponent {

  // Public data
  titleHTML: string = '';
  bodyHTML: string = '';
  trueButtonHTML: string = '';

  // Private data
  @ViewChild('oneButtonModal')
  private _elementRef: ElementRef;
  private _eventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Injection
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  // Set the modal
  set(titleHTML: string, bodyHTML: string, trueButtonHTML: string): EventEmitter<boolean> {
    this.titleHTML = titleHTML;
    this.bodyHTML = bodyHTML;
    this.trueButtonHTML = trueButtonHTML;

    this.changeDetectorRef.detectChanges();

    return this._eventEmitter;
  }

  // Show the modal
  show() {
    new Modal(this._elementRef.nativeElement).show();
  }

  // On click the modal button
  onClickModalButton(value: boolean) {
    this._eventEmitter.emit(value);
  }
}
