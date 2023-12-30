import { DesktopFile } from "./desktop-file";

export interface DesktopFilePackage {

    message: string;
    desktopFilesHashCode: number;
    desktopFiles: DesktopFile[];
}
