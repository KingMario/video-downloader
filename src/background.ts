import find from "lodash/find";
import findIndex from "lodash/findIndex";
import type { DownloadItem, VideoInfo } from "./interfaces";

const menuItemId = "download_video";
const tabVideoInfo: Record<number, VideoInfo> = {};
const downloadList: DownloadItem[] = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();

  chrome.contextMenus.create({
    contexts: ["action", "link", "page"],
    documentUrlPatterns: ["https://*.URL_IDENTIFICATION_STRING/*"],
    id: menuItemId,
    title: "Download Video",
    enabled: false,
  });
});

const updateState = (tab: chrome.tabs.Tab | undefined) => {
  if (tab?.active) {
    const videoInfo = tabVideoInfo[tab.id!];
    if (videoInfo) {
      chrome.contextMenus.update(menuItemId, {
        enabled: true,
      });
      chrome.action.enable(tab?.id);
    } else {
      chrome.contextMenus.update(menuItemId, {
        enabled: false,
      });
      chrome.action.disable(tab?.id);
    }
  }
};

chrome.runtime.onMessage.addListener((videoInfo: VideoInfo | null, { tab }) => {
  if (tab?.id) {
    if (videoInfo) {
      tabVideoInfo[tab.id] = videoInfo;
    } else {
      delete tabVideoInfo[tab.id];
    }
  }

  updateState(tab);
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab) {
      updateState(tab);
    }
  });
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  chrome.tabs.query({ active: true, windowId }, (tabs) => {
    tabs.forEach((tab) => {
      updateState(tab);
    });
  });
});

const downloadVideo = (tabId: number | undefined) => {
  if (!tabId || !tabVideoInfo[tabId]) {
    return;
  }

  const { title, sectionName, videoIndex, videoName, videoUrl } =
    tabVideoInfo[tabId];

  if (videoUrl && !find(downloadList, { videoUrl })) {
    chrome.downloads.download(
      {
        url: videoUrl,
        conflictAction: "overwrite",
        filename: `${title}/${sectionName}/${videoIndex} ${videoName}.mp4`,
      },
      (id) => {
        downloadList.push({ tabId, downloadId: id, videoUrl });
        chrome.action.setBadgeText({
          tabId,
          text: `${downloadList.length}`,
        });
      }
    );
  }
};

chrome.downloads.onChanged.addListener(({ id: downloadId, state }) => {
  if (!["complete", "interrupted"].includes(state?.current || "")) {
    return;
  }

  const downloadIdx = findIndex(downloadList, { downloadId });

  if (downloadIdx > -1) {
    const { tabId, downloadId } = downloadList[downloadIdx];

    chrome.downloads.erase({
      id: downloadId,
    });

    downloadList.splice(downloadIdx, 1);

    const text = downloadList.length ? `${downloadList.length}` : "";
    chrome.action.setBadgeText({
      tabId,
      text,
    });
  }
});

chrome.contextMenus.onClicked.addListener((_, tab) => {
  downloadVideo(tab?.id);
});

chrome.action.setBadgeBackgroundColor({ color: "#faa732" });
chrome.action.onClicked.addListener(({ id }) => downloadVideo(id));
