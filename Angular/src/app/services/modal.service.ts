import { Injectable, ViewContainerRef } from '@angular/core';
import { finalize, take } from 'rxjs';
import { OneButtonModalComponent } from '../components/user_interfaces/modal/one-button-modal/one-button-modal.component';
import { TwoButtonModalComponent } from '../components/user_interfaces/modal/two-button-modal/two-button-modal.component';
import { ErrorModalData } from '../models/error-modal-data.models';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  // Private data
  private _viewContainerRef: ViewContainerRef;

  // Init
  init(viewContainerRef: ViewContainerRef) {
    this._viewContainerRef = viewContainerRef;
  }

  // Execute the one-button modal
  executeOneButtonModal(
    titleHTML: string, bodyHTML: string, trueButtonHTML: string,
    trueButtonCallback?: () => void, falseButtonCallback?: () => void) {
    const modalComponent: OneButtonModalComponent = this._viewContainerRef.createComponent(OneButtonModalComponent).instance;

    modalComponent.set(titleHTML, bodyHTML, trueButtonHTML)
      .pipe(
        take(1),
        finalize(() => {
          this._viewContainerRef.clear();
        })
      )
      .subscribe((value: boolean) => {
        value ? trueButtonCallback?.() : falseButtonCallback?.();
      });

    modalComponent.show();
  }

  // Execute the two-button modal
  executeTwoButtonModal(
    titleHTML: string, bodyHTML: string, trueButtonHTML: string, falseButtonHTML: string,
    trueButtonCallback?: () => void, falseButtonCallback?: () => void) {
    const modalComponent: TwoButtonModalComponent = this._viewContainerRef.createComponent(TwoButtonModalComponent).instance;

    modalComponent.set(titleHTML, bodyHTML, trueButtonHTML, falseButtonHTML)
      .pipe(
        take(1),
        finalize(() => {
          this._viewContainerRef.clear();
        })
      )
      .subscribe((value: boolean) => {
        value ? trueButtonCallback?.() : falseButtonCallback?.();
      });

    modalComponent.show();
  }

  // Execute the error modal
  executeErrorModal(errorModalData: ErrorModalData) {
    this.executeOneButtonModal(errorModalData.titleHTML, errorModalData.bodyHTML, errorModalData.trueButtonHTML);
  }
}
