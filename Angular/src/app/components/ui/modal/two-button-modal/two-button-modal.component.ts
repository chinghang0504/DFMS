import { ChangeDetectorRef, Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-two-button-modal',
  templateUrl: './two-button-modal.component.html',
  styleUrl: './two-button-modal.component.css'
})
export class TwoButtonModalComponent {

  // UI data
  @ViewChild('twoButtonModal') modalElementRef: ElementRef;
  modalTitle: string;
  modalBody: string;
  trueButtonText: string;
  falseButtonText: string;

  // Internal data
  private _modalEventEmitter: EventEmitter<boolean>;

  // Injection
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  // Set the modal
  setModal(modalTitle: string, modalBody: string, trueButtonText: string, falseButtonText: string): EventEmitter<boolean> {
    this.modalTitle = modalTitle;
    this.modalBody = modalBody;
    this.trueButtonText = trueButtonText;
    this.falseButtonText = falseButtonText;

    this.changeDetectorRef.detectChanges();

    return this._modalEventEmitter = new EventEmitter<boolean>();
  }

  // Show the modal
  showModal() {
    new Modal(this.modalElementRef.nativeElement).show();
  }

  // On click the modal button
  onClickModalButton(result: boolean) {
    this._modalEventEmitter.emit(result);
  }
}
