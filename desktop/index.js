const { initRemix } = require('remix-electron');
const { app, BrowserWindow, dialog, session } = require('electron');
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
console.log(path.join(__dirname, 'preload', 'process.js'));
/** @param {string} url */
async function createWindow(url) {
  const partitionSession = session.fromPartition('persist:session');
  // const sessionCookie = store.get("__session");
  // if (sessionCookie) {
  //   await partitionSession.cookies.set(sessionCookie);
  // }

  win = new BrowserWindow({
    show: false,
    height: 1200,
    width: 1200,
    titleBarOverlay: false,
    webPreferences: {
      nodeIntegration: true
      // partition: 'persist:session',
      // session: partitionSession
      // preload: path.join(__dirname, 'preload', 'process.js')
    }
  });
  await win.loadURL(url);
  win.show();

  win.webContents.session.cookies.on(
    'changed',
    (event, cookie, cause, removed) => {
      console.log(cookie, event, cause);
      win?.webContents.session.cookies.set({
        ...cookie,
        url: 'http://localhost:3000'
      });
      // if(event === )
    }
  );
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
      console.log(url);
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
