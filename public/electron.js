const path = require('path')
const url = require('url')

const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    show: false // Don't show the window initially
  })

  // Start URL for production
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  //load the index.html from a url
  win.loadURL('http://localhost:3000');


  // Show when the React app is ready
    win.once('ready-to-show', () => {
    win.webContents.openDevTools()
    win.setTitle('PassNow')
    win.show()
  })


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
