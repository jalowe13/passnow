# Jacob Lowe
import subprocess
import os
import sys
import logging

# Set up logging
logging.basicConfig(filename='app.log', level=logging.DEBUG, 
                    format='%(asctime)s - %(levelname)s - %(message)s')

def main():
    try:
        # Get the directory of the executable
        if getattr(sys, 'frozen', False):
            script_dir = sys._MEIPASS
        else:
            script_dir = os.path.dirname(os.path.abspath(__file__))

        # Change to the script directory
        os.chdir(script_dir)
        batch_file = os.path.join(script_dir, 'start_app.bat')

        if not os.path.exists(batch_file):
            logging.error(f"Batch file not found at {batch_file}")
            raise FileNotFoundError(f"Batch file not found at {batch_file}")

        # Call batch file
        logging.info(f"Attempting to call {batch_file}")
        result = subprocess.run([batch_file], shell=True, capture_output=True, text=True)
        
        logging.info(f"Subprocess return code: {result.returncode}")
        logging.info(f"Subprocess stdout: {result.stdout}")
        logging.info(f"Subprocess stderr: {result.stderr}")

    except Exception as e:
        logging.exception("An error occurred")

if __name__ == "__main__":
    main()
    input("Press Enter to exit...")
