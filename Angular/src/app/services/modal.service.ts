import { Injectable, ViewContainerRef } from '@angular/core';
import { finalize, take } from 'rxjs';
import { TwoButtonModalComponent } from '../components/two-button-modal/two-button-modal.component';
import { OneButtonModalComponent } from '../components/one-button-modal/one-button-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  // Internal data
  private _modalViewContainerRef: ViewContainerRef;

  // Init
  init(modalViewContainerRef: ViewContainerRef) {
    this._modalViewContainerRef = modalViewContainerRef;
  }

  // Execute the two button modal
  executeTwoButtonModal(
    modalTitle: string, modalBody: string,
    trueButtonText: string, falseButtonText: string,
    trueButtonCallback?: () => void, falseButtonCallback?: () => void) {
    const modalComponent: TwoButtonModalComponent = this._modalViewContainerRef.createComponent(TwoButtonModalComponent).instance;

    modalComponent.setModal(modalTitle, modalBody, trueButtonText, falseButtonText)
      .pipe(
        take(1),
        finalize(() => {
          this._modalViewContainerRef.clear();
        })
      )
      .subscribe((value: boolean) => {
        value ? trueButtonCallback?.() : falseButtonCallback?.();
      });

    modalComponent.showModal();
  }

  // Execute the one button modal
  executeOneButtonModal(
    modalTitle: string, modalBody: string,
    trueButtonText: string,
    trueButtonCallback?: () => void, falseButtonCallback?: () => void) {
    const modalComponent: OneButtonModalComponent = this._modalViewContainerRef.createComponent(OneButtonModalComponent).instance;

    modalComponent.setModal(modalTitle, modalBody, trueButtonText)
      .pipe(
        take(1),
        finalize(() => {
          this._modalViewContainerRef.clear();
        })
      )
      .subscribe((value: boolean) => {
        value ? trueButtonCallback?.() : falseButtonCallback?.();
      });

    modalComponent.showModal();
  }
}
