
const {app, BrowserWindow, screen} = require('electron')
const { spawn } = require('child_process');
const path = require('path')
const url = require('url')
const waitOn = require('wait-on')
const chalk = require('chalk');  


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

  console.log('Starting the app...')
  const start = spawn('npm', ['run', 'startapp'], { shell: true });

  start.stdout.on('data', (data) => {
    win.webContents.send('log', `[Start]: ${data}`);
  });

// Arguments for staring go server or not

const args = process.argv.slice(2);

// Convert argument into boolean to start go service or not
const startGo = args.includes('true');

console.log(`Starting up`);

// Only start go backend if argument is true
const processToKill = 'server.exe';
if (startGo){
  const backend = spawn('npm', ['run', 'start-go'], { shell: true });
  backend.stdout.on('data', (data) => {
  console.log(chalk.green(`[Backend]: ${data}`));
});
}else{
  console.log(chalk.red('Not starting go server'));
  console.log(chalk.red('Please start go uvicorn manually with npm run start-uvicorn'));
  console.log(chalk.red('Starting dynamo'));
  const dynamo = spawn('npm', ['run', 'start-dynamo'], { shell: true });
  dynamo.stdout.on('data', (data) => {
  console.log(chalk.green(`[DynamoGB]: ${data}`));
});
}

const frontend = spawn('npm', ['run', 'start'], { shell: true });





frontend.stdout.on('data', (data) => {
  console.log(chalk.blue(`[Frontend]: ${data}`));
});









  console.log('App started!')
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

  console.log('Starting the server...')

  //load the index.html from a url wait for the server to be ready
  waitOn({ resources: ['http://localhost:3000'] }, err => {
    if (err) {
      console.error('Error waiting for the server:', err);
      return;
    }

  // Load the React app
  console.log('Server ready!')

    win.loadURL("http://localhost:3000")
  // Show when the React app is ready

  // Disable Scrollbar
    win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
      body {
        overflow: hidden;
      }
    `);
  });
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
