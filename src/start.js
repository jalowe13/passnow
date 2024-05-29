// Jacob Lowe
// This file is used to start the frontend and backend servers at the same time. This is useful for development purposes.

const { exec, spawn } = require('child_process');
const chalk = require('chalk');  

//const uvicorn = spawn('npm', ['run', 'start-uvicorn'], { shell: true, detached: true});
const dynamo = spawn('npm', ['run', 'start-dynamo'], { shell: true });
const electron = spawn('npm', ['run', 'electron-start'], { shell: true });
const frontend = spawn('npm', ['run', 'start'], { shell: true });
//const backend = spawn('npm', ['run', 'start-go'], { shell: true });

electron.stdout.on('data', (data) => {
  console.log(chalk.yellow(`[Electron]: ${data}`));
});

frontend.stdout.on('data', (data) => {
  console.log(chalk.blue(`[Frontend]: ${data}`));
});

dynamo.stdout.on('data', (data) => {
  console.log(chalk.green(`[DynamoGB]: ${data}`));
});

// uvicorn.stdout.on('data', (data) => {
//   console.log(chalk.greenBright(`[Uvicorn]: ${data}`));
// }); 
// uvicorn.on('error', (error) => {
//   console.error(`Error starting uvicorn: ${error.message}`);
// });


// backend.stdout.on('data', (data) => {
//   console.log(chalk.green(`[Backend]: ${data}`));
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