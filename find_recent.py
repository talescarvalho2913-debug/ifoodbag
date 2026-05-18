import os
import time

current_time = time.time()
search_paths = [
    os.path.expanduser("~/Desktop"),
    os.path.expanduser("~/Downloads"),
    os.path.expanduser("~/Pictures")
]

recent_files = []

for path in search_paths:
    if os.path.exists(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                file_path = os.path.join(root, file)
                try:
                    mtime = os.path.getmtime(file_path)
                    if current_time - mtime < 600: # Last 10 minutes
                        if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                            recent_files.append((mtime, file_path))
                except:
                    continue

recent_files.sort(reverse=True)
for mtime, path in recent_files[:10]:
    print(f"{time.ctime(mtime)}: {path}")
