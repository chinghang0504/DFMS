export interface DesktopFile {

    name: string;
    lastModified: number;
    type: string;
    size: number;

    absolutePath: string;
    parentPath: string;

    isFolder: boolean;
    isHidden: boolean;

    tags: string[];
}
