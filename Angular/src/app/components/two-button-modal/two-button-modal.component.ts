import { ChangeDetectorRef, Component, ElementRef, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs';
import * as bootstrap from "bootstrap";

@Component({
  selector: 'app-two-button-modal',
  templateUrl: './two-button-modal.component.html',
  styleUrl: './two-button-modal.component.css'
})
export class TwoButtonModalComponent {

  // UI data
  @ViewChild('twoButtonModal') modalElementRef: ElementRef;
  modalTitle: string;
  modalMessage: string;
  trueButtonTitle: string;
  falseButtonTitle: string;

  // Internal data
  private modalEventEmitter: EventEmitter<boolean>;

  // Injection
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  // Set the modal
  private setModal(modalTitle: string, modalMessage: string, trueButtonTitle: string, falseButtonTitle: string): EventEmitter<boolean> {
    this.modalTitle = modalTitle;
    this.modalMessage = modalMessage;
    this.trueButtonTitle = trueButtonTitle;
    this.falseButtonTitle = falseButtonTitle;

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
    modalTitle: string, modalMessage: string, trueButtonTitle: string, falseButtonTitle: string,
    trueCallback?: () => void, falseCallback?: () => void) {
    const modalComponent: TwoButtonModalComponent = modalViewContainerRef.createComponent(TwoButtonModalComponent).instance;

    modalComponent.setModal(modalTitle, modalMessage, trueButtonTitle, falseButtonTitle)
      .pipe(take(1))
      .subscribe((value: boolean) => {
        value ? trueCallback?.() : falseCallback?.();

        modalViewContainerRef.clear();
      });

    modalComponent.showModal();
  }
}