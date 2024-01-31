import { CommunicationPackage } from "./communication.package";

export interface SettingsPackage extends CommunicationPackage {

    homeFolderPath: string;
    filesPerPage: number;

    showHidden: boolean;
    
    tagRemovalDoubleConfirmation: boolean;
}
