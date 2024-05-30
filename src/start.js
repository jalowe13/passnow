// Jacob Lowe
// This file is used to start the frontend and backend servers at the same time. This is useful for development purposes.

const { exec, spawn } = require('child_process');
const chalk = require('chalk');  

//const uvicorn = spawn('npm', ['run', 'start-uvicorn'], { shell: true, detached: true});

// Arguments for staring go server or not

const args = process.argv.slice(2);

// Convert argument into boolean to start go service or not
const startGo = args.includes('true');

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

const electron = spawn('npm', ['run', 'electron-start'], { shell: true });
const frontend = spawn('npm', ['run', 'start'], { shell: true });


electron.stdout.on('data', (data) => {
  console.log(chalk.yellow(`[Electron]: ${data}`));
});

frontend.stdout.on('data', (data) => {
  console.log(chalk.blue(`[Frontend]: ${data}`));
});



// uvicorn.stdout.on('data', (data) => {
//   console.log(chalk.greenBright(`[Uvicorn]: ${data}`));
// }); 
// uvicorn.on('error', (error) => {
//   console.error(`Error starting uvicorn: ${error.message}`);
// });




electron.on('close', () => {
    console.log('Electron process closed');
    closeProcesses();
});

function closeProcesses() {
    console.log('Closing processes...');
    // Close front
    exec(`taskkill /PID ${frontend.pid} /F`, (error) => {
        if (error) {
            console.error(`Failed to kill frontend: ${error}`);
        }
    });

    // exec(`taskkill /PID ${backend.pid} /F`, (error) => {
    //     if (error) {
    //         console.error(`Failed to kill backend: ${error}`);
    //     }
    // });

    exec(`taskkill /IM ${processToKill} /F`, (error) => {
        if (error) {
            console.error(`Failed to kill ${processToKill}: ${error}`);
        }
    });
}