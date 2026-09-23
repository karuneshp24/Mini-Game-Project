import os
import tarfile
import requests
import time

email = "bdaytest2026@gmail.com"
token = "846b2deae4eae322cd2e1793a6e6f165"
domain = "diii-birthday-surprise-2026.surge.sh"
folder = r"c:\Users\Karunesh P\OneDrive\Desktop\PROXEND\bdayyy"
tgz_file = r"c:\Users\Karunesh P\OneDrive\Desktop\PROXEND\bdayyy\site_bundle.tgz"

# Delete old tar if exists
if os.path.exists(tgz_file):
    os.remove(tgz_file)

print(f"Creating site_bundle.tgz...")
file_count = 0

with tarfile.open(tgz_file, mode="w:gz", format=tarfile.DEFAULT_FORMAT) as tar:
    for root, dirs, files in os.walk(folder):
        for f in files:
            if f.endswith('.zip') or f.endswith('.py') or f.endswith('.tgz') or 'surge_pkg' in root or '.git' in root or 'node_modules' in root:
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, folder).replace('\\', '/')
            tar.add(full_path, arcname=rel_path)
            file_count += 1

size = os.path.getsize(tgz_file)
print(f"site_bundle.tgz created with {file_count} files, size: {size} bytes")

headers = {
    "version": "0.23.0",
    "file-count": str(file_count),
    "project-size": str(size),
    "timestamp": "2026-09-23T12:00:00.000Z",
    "Connection": "keep-alive"
}

deploy_url = f"https://surge.surge.sh/{domain}"
print(f"Streaming upload to Surge CDN at {deploy_url}...")

with open(tgz_file, "rb") as f_data:
    resp = requests.put(deploy_url, auth=("token", token), headers=headers, data=f_data)

print("Deploy Response Code:", resp.status_code)
lines = [l for l in resp.text.splitlines() if l.strip()]
for line in lines[-8:]:
    print("Log Line:", line)

time.sleep(3)
chk = requests.get(f"https://{domain}")
print(f"\n==========================================")
print(f"Verification for https://{domain}: {chk.status_code}")
print(f"==========================================")
print("Snippet:", chk.text[:200])
