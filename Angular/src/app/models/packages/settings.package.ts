import { CommunicationPackage } from "./communication.package";

export interface SettingsPackage extends CommunicationPackage {

    homeFolderPath: string;
    showHidden: boolean;
    tagRemovalDoubleConfirmation: boolean;
}
