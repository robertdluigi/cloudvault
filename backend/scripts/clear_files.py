import os
import time
from datetime import datetime, timedelta

UPLOADS_DIR = './uploads'  # Path to your uploads folder
MAX_FILE_AGE = 30  # Files older than 30 days will be deleted

def delete_old_files():
    current_time = time.time()
    cutoff_time = current_time - (MAX_FILE_AGE * 86400)  # Convert days to seconds

    for root, dirs, files in os.walk(UPLOADS_DIR):
        for file in files:
            file_path = os.path.join(root, file)
            file_mod_time = os.path.getmtime(file_path)

            if file_mod_time < cutoff_time:
                print(f"Deleting file: {file_path}")
                os.remove(file_path)

if __name__ == "__main__":
    delete_old_files()
