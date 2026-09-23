import requests
import json
import tarfile
import os
import io
import time

email = "bdaytest2026@gmail.com"
token = "846b2deae4eae322cd2e1793a6e6f165"

domain = "diii-birthday-surprise-2026.surge.sh"
folder = r"c:\Users\Karunesh P\OneDrive\Desktop\PROXEND\bdayyy"

print(f"Packaging files into tar.gz...")

tar_buf = io.BytesIO()
file_count = 0

with tarfile.open(fileobj=tar_buf, mode="w:gz") as tar:
    for root, dirs, files in os.walk(folder):
        for f in files:
            if f.endswith('.zip') or f.endswith('.py') or f.endswith('.tgz') or 'surge_pkg' in root or '.git' in root:
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, folder).replace('\\', '/')
            tar.add(full_path, arcname=rel_path)
            file_count += 1

tar_bytes = tar_buf.getvalue()
print(f"Tar.gz created with {file_count} files, size: {len(tar_bytes)} bytes")

headers = {
    "version": "0.23.0",
    "file-count": str(file_count),
    "project-size": str(len(tar_bytes)),
    "timestamp": "2026-09-23T12:00:00.000Z",
    "Content-Type": "application/octet-stream"
}

deploy_url = f"https://surge.surge.sh/{domain}"
print(f"Deploying to Surge CDN at {deploy_url}...")

resp = requests.put(deploy_url, auth=("token", token), headers=headers, data=tar_bytes)
print("Deploy HTTP Status:", resp.status_code)
lines = resp.text.strip().split('\n')
for line in lines[-5:]:
    print("Log Line:", line)

time.sleep(3)
check = requests.get(f"https://{domain}")
print(f"\nVerification Check status code for https://{domain}:", check.status_code)
print("Snippet:", check.text[:200])
