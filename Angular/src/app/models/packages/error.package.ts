import { CommunicationPackage } from "./communication.package";

export interface ErrorPackage extends CommunicationPackage {

    message: string;
}
