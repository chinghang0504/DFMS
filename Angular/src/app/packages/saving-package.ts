import { FileTagsPackage } from "./file-tags-package";
import { SettingsPackage } from "./settings-package";

export interface SavingPackage {

    settingsPackage: SettingsPackage;
    fileTagsPackage: FileTagsPackage;
}
