const { initRemix } = require('remix-electron');
const { app, BrowserWindow, dialog } = require('electron');
const path = require('node:path');
const Sentry = require('@sentry/electron');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
/** @type {BrowserWindow | undefined} */
let win;
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://5a20319e63be94cd9533a19e7349df95@o4505892775395328.ingest.sentry.io/4506466266906624'
  });
}

/** @param {string} url */
async function createWindow(url) {
  win = new BrowserWindow({
    show: false,
    height: 1200,
    width: 1200,
    titleBarOverlay: false,
    titleBarStyle: 'hidden'
  });
  await win.loadURL(url);
  win.show();
}

app.on('ready', () => {
  void (async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        const {
          default: installExtension,
          REACT_DEVELOPER_TOOLS
        } = require('electron-devtools-installer');

        await installExtension(REACT_DEVELOPER_TOOLS);
      }

      const url = await initRemix({
        serverBuild: path.join(__dirname, '../build/index.js')
      });
      await createWindow(url);
    } catch (error) {
      dialog.showErrorBox('Error', getErrorStack(error));
      console.error(error);
    }
  })();
});

/** @param {unknown} error */
function getErrorStack(error) {
  return error instanceof Error ? error.stack || error.message : String(error);
}
