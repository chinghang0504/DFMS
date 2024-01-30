import { DesktopFile } from "../desktop-file.model";
import { CommunicationPackage } from "./communication.package";

export interface DesktopFilesPackage extends CommunicationPackage {

    fileList: DesktopFile[];
    folderList: DesktopFile[];
}
