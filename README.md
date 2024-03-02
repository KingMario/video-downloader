# Video Downloader Chrome Extension

This Chrome extension, named "Video Downloader", allows users to download videos from LinkedIn Learning. It integrates into the Chrome browser, providing a convenient way to save videos directly to your computer.

## Features

- **Context Menu Integration**: Right-click to download the video from the page you're viewing.
- **Automatic Video Detection**: The extension detects when you're on a LinkedIn Learning video page and enables the download option.
- **Download Management**: Downloads are managed and tracked within the extension, ensuring no duplicates.
- **Organized Downloads**: The extension automatically organizes downloaded videos by creating a dedicated folder for each course. Within each course folder, it further categorizes videos into section folders. Additionally, each video file is prefixed with the sequence number of its section, ensuring a structured and easily navigable collection of downloads.

## Installation

To install the extension:

1. Clone this repository to your local machine.
2. Run `npm install` to install the necessary dependencies.
3. Build the extension using `npm run build`. This compiles the TypeScript files and copies necessary assets to the `dist` directory.
4. The `tools/replace-url.js` script updates the URL placeholders in the `dist/background.js` and `dist/manifest.json` files to target LinkedIn Learning.
5. Load the `dist` folder as an unpacked extension in Chrome.

## Usage

After installation, navigate to a LinkedIn Learning video page. The extension icon becomes active, indicating that videos can be downloaded. Right-click on the page and select "Download Video" or click on the extension icon to save the video to your computer.

## Development

This project uses TypeScript for development. The main logic is contained within `src/background.ts` for background tasks and `src/content.ts` for content scripts that interact with web pages.

Webpack is used to bundle the scripts, configured in `webpack/webpack.config.js`. The build process is initiated with the `npm run build` command, which also triggers the URL replacement script.

## Known Issue

- **Issue with Window Switching**: When moving between different windows, there might be a slight delay in the **Automatic Video Detection** feature. To make sure that the download option status is accurately updated, kindly wait for about 1 second after switching windows.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with your proposed changes or improvements.

## License

This project is licensed under the MIT License.
