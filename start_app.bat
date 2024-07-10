:: Jacob Lowe
:: Start Passnow application
@echo off
echo Starting Docker container...
start cmd /k "docker start inspiring_knuth && docker logs -f inspiring_knuth && pause"

echo Starting Electron...
start cmd /k "npm run electron-start && pause"

echo Starting Uvicorn...
start cmd /k "call C:\ProgramData\miniconda3\Scripts\activate.bat passnow && npm run start-uvicorn && pause"

echo Press any key to stop the docker container and exit...
pause
docker stop inspiring_knuth