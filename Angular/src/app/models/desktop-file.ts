export interface DesktopFile {

    name: string;
    lastModified: number;
    extension: string;
    size: number;

    absolutePath: string;

    isFolder: boolean;
    isHidden: boolean;
}
