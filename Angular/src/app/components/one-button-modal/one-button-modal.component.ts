import { ChangeDetectorRef, Component, ElementRef, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs';
import * as bootstrap from "bootstrap";

@Component({
  selector: 'app-one-button-modal',
  templateUrl: './one-button-modal.component.html',
  styleUrl: './one-button-modal.component.css'
})
export class OneButtonModalComponent {

  // UI Data
  @ViewChild('oneButtonModal') modalElementRef: ElementRef;
  modalTitle: string;
  modalMessage: string;
  trueButtonTitle: string;

  // Internal Data
  private modalEventEmitter: EventEmitter<boolean>;

  // Injection
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  // Set the modal
  private setModal(modalTitle: string, modalMessage: string, trueButtonTitle: string): EventEmitter<boolean> {
    this.modalTitle = modalTitle;
    this.modalMessage = modalMessage;
    this.trueButtonTitle = trueButtonTitle;

    this.changeDetectorRef.detectChanges();

    return this.modalEventEmitter = new EventEmitter<boolean>();
  }

  // Show the modal
  private showModal() {
    $(this.modalElementRef.nativeElement).modal('show');
  }

  // On click the modal button
  onClickModalButton(result: boolean) {
    this.modalEventEmitter.emit(result);
  }

  // Execute the modal
  static executeModal(
    modalViewContainerRef: ViewContainerRef,
    modalTitle: string, modalMessage: string, trueButtonTitle: string,
    trueCallback?: () => void, falseCallback?: () => void) {
    const modalComponent: OneButtonModalComponent = modalViewContainerRef.createComponent(OneButtonModalComponent).instance;

    modalComponent.setModal(modalTitle, modalMessage, trueButtonTitle)
      .pipe(take(1))
      .subscribe((value: boolean) => {
        value ? trueCallback?.() : falseCallback?.();

        modalViewContainerRef.clear();
      });

    modalComponent.showModal();
  }
}