export interface DownloadItem {
  tabId: number;
  downloadId: number;
  videoUrl: string;
}

export interface VideoInfo {
  title?: string;
  sectionName?: string;
  videoIndex?: number;
  videoName?: string;
  videoUrl?: string;
}
