// Jacob Lowe
// This file is used to start the frontend and backend servers at the same time. This is useful for development purposes.

const { exec, spawn } = require('child_process');
const chalk = require('chalk');  

const electron = spawn('npm', ['run', 'electron-start'], { shell: true });
const frontend = spawn('npm', ['run', 'start'], { shell: true });
const backend = spawn('npm', ['run', 'start-go'], { shell: true });
const processToKill = 'main.exe';

electron.stdout.on('data', (data) => {
  console.log(chalk.yellow(`[Electron]: ${data}`));
});

frontend.stdout.on('data', (data) => {
  console.log(chalk.blue(`[Frontend]: ${data}`));
});

backend.stdout.on('data', (data) => {
  console.log(chalk.green(`[Backend]: ${data}`));
});

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

    exec(`taskkill /PID ${backend.pid} /F`, (error) => {
        if (error) {
            console.error(`Failed to kill backend: ${error}`);
        }
    });

    exec(`taskkill /IM ${processToKill} /F`, (error) => {
        if (error) {
            console.error(`Failed to kill ${processToKill}: ${error}`);
        }
    });
}