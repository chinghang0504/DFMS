import { DesktopFile } from "../desktop-file.model";
import { CommunicationPackage } from "./communication.package";

export interface DesktopFilePackage extends CommunicationPackage {

    desktopFile: DesktopFile;
}
