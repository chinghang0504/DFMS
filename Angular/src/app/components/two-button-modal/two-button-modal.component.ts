import { ChangeDetectorRef, Component, ElementRef, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { Modal } from 'bootstrap';
import { take } from 'rxjs';

@Component({
  selector: 'app-two-button-modal',
  templateUrl: './two-button-modal.component.html',
  styleUrl: './two-button-modal.component.css'
})
export class TwoButtonModalComponent {

  // UI Data
  @ViewChild('twoButtonModal') modalElementRef: ElementRef;
  modalTitle: string;
  modalMessage: string;
  trueButtonTitle: string;
  falseButtonTitle: string;

  // Internal Data
  private modal: Modal;
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

    this.modal = new Modal(this.modalElementRef.nativeElement);
    this.modalEventEmitter = new EventEmitter<boolean>();

    return this.modalEventEmitter;
  }

  // Show the modal
  private showModal() {
    this.modal.show();
  }

  // On click the modal button
  onClickModalButton(result: boolean) {
    this.modalEventEmitter.emit(result);
  }

  // Execute the dyanmic modal
  static executeDyanmicModal(
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