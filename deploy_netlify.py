import os
import zipfile
import requests

def build_zip():
    zip_filename = "site.zip"
    folder_to_zip = "c:\\Users\\Karunesh P\\OneDrive\\Desktop\\PROXEND\\bdayyy"
    
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_to_zip):
            for file in files:
                if file.endswith('.zip') or file.endswith('.py'):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, folder_to_zip)
                zipf.write(file_path, arcname)
    print(f"Zip file created: {zip_filename}")
    return zip_filename

def deploy_to_netlify(zip_filename):
    url = "https://api.netlify.com/api/v1/sites"
    headers = {
        "Content-Type": "application/zip"
    }
    with open(zip_filename, "rb") as f:
        data = f.read()
    
    response = requests.post(url, headers=headers, data=data)
    print("Response Status:", response.status_code)
    print("Response Body:", response.text[:500])

if __name__ == "__main__":
    z = build_zip()
    deploy_to_netlify(z)
