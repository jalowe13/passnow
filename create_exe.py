import subprocess

subprocess.run('pyinstaller --name Passnow --add-data "start_app.bat;." --onedir start_app_wrapper.py', )