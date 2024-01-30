import { ErrorPackage } from "../models/packages/error.package";
import { LoadingService } from "../services/loading.service";
import { ModalService } from "../services/modal.service";

export class ErrorManager {

    static readonly ERROR_TITLE_SYSTEM_ERROR: string = 'System Error';

    // Handle error
    static handleError(err:any, modalService: ModalService, loadingService: LoadingService) {
        if (err['status'] === 400) {
            modalService.executeOneButtonModal(this.ERROR_TITLE_SYSTEM_ERROR, (err['error'] as ErrorPackage).message, 'OK');
        } else {
            loadingService.isRunning = false;
        }
    }
}
