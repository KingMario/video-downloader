import type { VideoInfo } from "./interfaces";

document.addEventListener("DOMContentLoaded", function () {
  let message: VideoInfo | null = null;

  const processName = (str?: string) =>
    str
      ? str
          .replace(/[:/\\]/g, " - ")
          .replace(/[?"]/g, "")
          .replace(/\s+/g, " ")
      : undefined;

  const getNameBySelector = (selector: string) =>
    processName((document.querySelector(selector) as HTMLElement)?.innerText);

  const observer = new MutationObserver(function () {
    const title = getNameBySelector(".classroom-nav__details h1");
    const sectionName = getNameBySelector(
      "section.classroom-toc-section:has(.classroom-toc-item--selected) h2 button"
    );

    const tocItemSelected = document.querySelector(
      ".classroom-toc-item--selected"
    );
    const videoIndex =
      tocItemSelected &&
      Array.from(tocItemSelected?.parentElement!.children).indexOf(
        tocItemSelected
      ) + 1;
    const videoName = getNameBySelector(".classroom-nav__details h2");
    const videoUrl = document.querySelector("video")?.getAttribute("src");

    let newMessage: VideoInfo | null = null;
    if (title && sectionName && videoIndex && videoName && videoUrl) {
      newMessage = { title, sectionName, videoIndex, videoName, videoUrl };
    }

    if (JSON.stringify(message) !== JSON.stringify(newMessage)) {
      message = newMessage;
      chrome.runtime.sendMessage(message);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  chrome.runtime.sendMessage(null);
});
