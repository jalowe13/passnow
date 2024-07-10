import subprocess

subprocess.run('pyinstaller --clean --name Passnow --icon lock.ico --add-data "start_app.bat;." --onedir start_app_wrapper.py', )
pause = input("Press Enter to exit...")