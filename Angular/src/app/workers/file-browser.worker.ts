/// <reference lib="webworker" />

import { FileBrowserService } from "../services/file-browser.service";

addEventListener('message', ({ data }) => {

  postMessage(FileBrowserService.filterAndSortDesktopFiles(data));
});
