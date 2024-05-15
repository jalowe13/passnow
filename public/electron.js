
const {app, BrowserWindow, screen} = require('electron')
const path = require('path')
const url = require('url')
const waitOn = require('wait-on')


function createWindow () {
  // Create the browser window and listen for screen size changes

  const {width, height} = screen.getPrimaryDisplay().workAreaSize
  const win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
      zoomFactor: 1.0 // Disable zooming
    },
    show: false // Don't show the window initially
  })

  // Adjust screen size per window size
  screen.on('display-metrics-changed', () => { 
    const {width, height} = screen.getPrimaryDisplay().workAreaSize
    win.setSize(width, height)
  })



  // Start URL for production
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  //load the index.html from a url wait for the server to be ready
  waitOn({ resources: ['http://localhost:3000'] }, err => {
    if (err) {
      console.error('Error waiting for the server:', err);
      return;
    }

    win.loadURL("http://localhost:3000")
  // Show when the React app is ready
    win.once('ready-to-show', () => {
    win.setTitle('PassNow')
    win.maximize()
    win.show()
  });
  });

}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
