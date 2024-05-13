# Jacob Lowe start application
import os
import subprocess

# Start the React app
subprocess.Popen('start cmd /k "title React App && npm start"', shell=True)

# Start the Go server
subprocess.Popen('start cmd /k "title Go Server && go run .\main.go serve"', cwd="src/backend", shell=True)

# Start the Electron app
subprocess.Popen('start cmd /k "title Electron App && npm run electron-start"', shell=True)