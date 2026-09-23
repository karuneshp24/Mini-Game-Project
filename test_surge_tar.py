import os
import tarfile
import io
import requests
import time

email = "bdaytest2026@gmail.com"
token = "846b2deae4eae322cd2e1793a6e6f165"
domain = "diii-birthday-surprise-2026.surge.sh"
folder = r"c:\Users\Karunesh P\OneDrive\Desktop\PROXEND\bdayyy"

tar_buf = io.BytesIO()
file_count = 0

with tarfile.open(fileobj=tar_buf, mode="w:gz", format=tarfile.PAX_FORMAT) as tar:
    for root, dirs, files in os.walk(folder):
        for d in dirs:
            if 'surge_pkg' in root or '.git' in root or 'node_modules' in root:
                continue
            dir_full = os.path.join(root, d)
            rel_dir = os.path.relpath(dir_full, folder).replace('\\', '/') + '/'
            ti_dir = tarfile.TarInfo(name=rel_dir)
            ti_dir.type = tarfile.DIRTYPE
            ti_dir.mode = 0o755
            tar.addfile(ti_dir)
            
        for f in files:
            if f.endswith('.zip') or f.endswith('.py') or f.endswith('.tgz') or 'surge_pkg' in root or '.git' in root or 'node_modules' in root:
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, folder).replace('\\', '/')
            
            with open(full_path, 'rb') as f_obj:
                content = f_obj.read()
            
            ti = tarfile.TarInfo(name=rel_path)
            ti.size = len(content)
            ti.mode = 0o644
            ti.type = tarfile.REGTYPE
            ti.mtime = int(os.path.getmtime(full_path))
            
            tar.addfile(ti, io.BytesIO(content))
            file_count += 1

tar_bytes = tar_buf.getvalue()
print(f"Directory-indexed TAR.GZ created: {len(tar_bytes)} bytes, {file_count} files")

headers = {
    "version": "0.23.0",
    "file-count": str(file_count),
    "project-size": str(len(tar_bytes)),
    "timestamp": "2026-09-23T12:00:00.000Z"
}

deploy_url = f"https://surge.surge.sh/{domain}"
print(f"Deploying to Surge CDN: {deploy_url}")

resp = requests.put(deploy_url, auth=("token", token), headers=headers, data=tar_bytes)
print("Response Status Code:", resp.status_code)
lines = [l for l in resp.text.splitlines() if l.strip()]
for line in lines[-6:]:
    print("Log Line:", line)

time.sleep(3)
chk = requests.get(f"https://{domain}")
print(f"\nVerification Check for https://{domain}: Status {chk.status_code}")
print("Snippet:", chk.text[:200])
