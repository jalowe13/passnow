// Jacob Lowe
// This file is used to start the frontend and backend servers at the same time. This is useful for development purposes.

const { exec, spawn } = require('child_process');
const { ipcRenderer } = require('electron'); // Send message from start to electron

//const uvicorn = spawn('npm', ['run', 'start-uvicorn'], { shell: true, detached: true});




// uvicorn.stdout.on('data', (data) => {
//   console.log(chalk.greenBright(`[Uvicorn]: ${data}`));
// }); 
// uvicorn.on('error', (error) => {
//   console.error(`Error starting uvicorn: ${error.message}`);
// });



/*
electron.on('close', () => {
    console.log('Electron process closed');
    closeProcesses();
});
*/

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