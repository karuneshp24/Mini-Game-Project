import os
import tarfile

folder = r"c:\Users\Karunesh P\OneDrive\Desktop\PROXEND\bdayyy"
tgz_file = r"c:\Users\Karunesh P\OneDrive\Desktop\PROXEND\bdayyy\fresh_bundle.tgz"

if os.path.exists(tgz_file):
    os.remove(tgz_file)

file_count = 0
with tarfile.open(tgz_file, mode="w:gz") as tar:
    for root, dirs, files in os.walk(folder):
        for f in files:
            if f.endswith('.zip') or f.endswith('.py') or f.endswith('.tgz') or 'surge_pkg' in root or '.git' in root or 'node_modules' in root:
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, folder).replace('\\', '/')
            tar.add(full_path, arcname=rel_path)
            file_count += 1

print(f"Fresh bundle created: {os.path.getsize(tgz_file)} bytes, {file_count} files")
