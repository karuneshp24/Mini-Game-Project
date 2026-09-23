import os
import zipfile
import requests
import json

folder = r"c:\Users\Karunesh P\OneDrive\Desktop\PROXEND\bdayyy"
zip_path = r"c:\Users\Karunesh P\OneDrive\Desktop\PROXEND\bdayyy\deploy.zip"

# Create zip
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(folder):
        for f in files:
            if f.endswith('.zip') or f.endswith('.py'):
                continue
            full_p = os.path.join(root, f)
            arc_p = os.path.relpath(full_p, folder)
            z.write(full_p, arc_p)

print(f"Zip created at {zip_path}, size: {os.path.getsize(zip_path)} bytes")

# Test 1: Tiiny host upload endpoint
try:
    with open(zip_path, 'rb') as f:
        r = requests.post("https://api.tiiny.host/v1/upload", files={"file": f}, data={"subdomain": "diii-birthday-surprise"})
        print("Tiiny Status:", r.status_code, r.text[:300])
except Exception as e:
    print("Tiiny Error:", e)

# Test 2: Static.app or surge test
try:
    with open(zip_path, 'rb') as f:
        r = requests.post("https://static.app/api/v1/upload", files={"file": f})
        print("Static.app Status:", r.status_code, r.text[:300])
except Exception as e:
    print("Static.app Error:", e)
