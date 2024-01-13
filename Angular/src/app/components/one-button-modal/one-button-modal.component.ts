import { ChangeDetectorRef, Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import * as bootstrap from "bootstrap";

@Component({
  selector: 'app-one-button-modal',
  templateUrl: './one-button-modal.component.html',
  styleUrl: './one-button-modal.component.css'
})
export class OneButtonModalComponent {

  // UI data
  @ViewChild('oneButtonModal') modalElementRef: ElementRef;
  modalTitle: string;
  modalBody: string;
  trueButtonText: string;

  // Internal data
  private _modalEventEmitter: EventEmitter<boolean>;

  // Injection
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  // Set the modal
  setModal(modalTitle: string, modalBody: string, trueButtonText: string): EventEmitter<boolean> {
    this.modalTitle = modalTitle;
    this.modalBody = modalBody;
    this.trueButtonText = trueButtonText;

    this.changeDetectorRef.detectChanges();

    return this._modalEventEmitter = new EventEmitter<boolean>();
  }

  // Show the modal
  showModal() {
    $(this.modalElementRef.nativeElement).modal('show');
  }

  // On click the modal button
  onClickModalButton(result: boolean) {
    this._modalEventEmitter.emit(result);
  }
}