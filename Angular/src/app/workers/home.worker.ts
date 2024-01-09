/// <reference lib="webworker" />

import { HomeService } from "../services/home.service";

addEventListener('message', ({ data }) => {

  postMessage(HomeService.updateDesktopFilesWorker(data));
});