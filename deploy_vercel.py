import os
import base64
import requests
import json

folder = r"c:\Users\Karunesh P\OneDrive\Desktop\PROXEND\bdayyy"

files_payload = []

for root, dirs, files in os.walk(folder):
    for f in files:
        if f.endswith('.zip') or f.endswith('.py') or f.endswith('.tgz') or 'surge_pkg' in root or '.git' in root or 'node_modules' in root:
            continue
        full_path = os.path.join(root, f)
        rel_path = os.path.relpath(full_path, folder).replace('\\', '/')
        
        with open(full_path, 'rb') as f_obj:
            content = f_obj.read()
        
        # Check if text or binary
        try:
            text_str = content.decode('utf-8')
            files_payload.append({
                "file": rel_path,
                "data": text_str
            })
        except UnicodeDecodeError:
            files_payload.append({
                "file": rel_path,
                "data": base64.b64encode(content).decode('utf-8'),
                "encoding": "base64"
            })

payload = {
    "name": "diii-birthday-surprise-2026",
    "files": files_payload,
    "projectSettings": {
        "framework": None
    }
}

print(f"Submitting {len(files_payload)} files to Vercel API...")
resp = requests.post("https://api.vercel.com/v13/deployments", json=payload)
print("Vercel Response Code:", resp.status_code)
print("Vercel Response:", resp.text[:400])
