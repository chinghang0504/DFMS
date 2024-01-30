import { CommunicationPackage } from "./communication.package";
import { SettingsPackage } from "./settings.package";
import { TagsPackage } from "./tags.package";

export interface SavingPackage extends CommunicationPackage {

    settingsPackage: SettingsPackage;
    tagsPackage: TagsPackage;
}
