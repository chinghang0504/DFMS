import { ChangeDetectorRef, Component, ElementRef, EventEmitter, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { Modal } from 'bootstrap';

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
  falseButtonTitle: string;
  trueButtonTitle: string;

  // Internal Data
  private modal: Modal;
  private modalEventEmitter: EventEmitter<boolean>;

  // Injection
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  // Set up the modal
  setupModal(modalTitle: string, modalMessage: string, trueButtonTitle: string, falseButtonTitle: string): EventEmitter<boolean> {
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
  showModal() {
    this.modal.show();
  }

  // Click the button
  onClickButton(result: boolean) {
    this.modalEventEmitter.emit(result);
  }

  // Handel the dyanmic modal
  static handleDyanmicModal(
    modalViewContainerRef: ViewContainerRef,
    modalTitle: string, modalMessage: string, trueButtonTitle: string, falseButtonTitle: string,
    trueAction: ()=>void = ()=>{}, falseAction: ()=>void = ()=>{}) {
      const modalComponentRef = modalViewContainerRef.createComponent(TwoButtonModalComponent);

      const modalEventEmitter = modalComponentRef.instance.setupModal(modalTitle, modalMessage, falseButtonTitle, trueButtonTitle);
      modalEventEmitter
        .subscribe((value: boolean) => {
          value ? trueAction() : falseAction();

          modalEventEmitter.unsubscribe();
          modalViewContainerRef.clear();
        })

    modalComponentRef.instance.showModal();
  }
}