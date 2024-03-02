import type { VideoInfo } from "./interfaces";

document.addEventListener("DOMContentLoaded", function () {
  let message: VideoInfo | null = null;

  const observer = new MutationObserver(function () {
    const title = (
      document.querySelector(".classroom-nav__details h1") as HTMLElement
    )?.innerText.replace(/:/g, " - ");

    const sectionName = (
      document.querySelector(
        "section.classroom-toc-section:has(.classroom-toc-item--selected) h2 button"
      ) as HTMLElement
    )?.innerText
      .replace(/:/g, " - ")
      .replace(/\?/g, "");

    const tocItemSelected = document.querySelector(
      ".classroom-toc-item--selected"
    );
    const videoIndex =
      tocItemSelected &&
      Array.from(tocItemSelected?.parentElement!.children).indexOf(
        tocItemSelected
      ) + 1;

    const videoName = (
      document.querySelector(".classroom-nav__details h2") as HTMLElement
    )?.innerText
      .replace(/:/g, " - ")
      .replace(/\?/g, "");

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
