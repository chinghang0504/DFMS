import { ChangeDetectorRef, Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-two-button-modal',
  templateUrl: './two-button-modal.component.html',
  styleUrl: './two-button-modal.component.css'
})
export class TwoButtonModalComponent {

  // Public data
  titleHTML: string = '';
  bodyHTML: string = '';
  trueButtonHTML: string = '';
  falseButtonHTML: string = '';

  // Private data
  @ViewChild('twoButtonModal')
  private _elementRef: ElementRef;
  private _eventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Injection
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  // Set the modal
  set(titleHTML: string, bodyHTML: string, trueButtonHTML: string, falseButtonHTML: string): EventEmitter<boolean> {
    this.titleHTML = titleHTML;
    this.bodyHTML = bodyHTML;
    this.trueButtonHTML = trueButtonHTML;
    this.falseButtonHTML = falseButtonHTML;

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
