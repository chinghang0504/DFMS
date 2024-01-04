import { DesktopFile } from "./desktop-file";

export interface DesktopFilePackage {

    desktopFilesHashCode: number;
    desktopFiles: DesktopFile[];
}
