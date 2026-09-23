import os
import sys
import tarfile
import urllib.request
import subprocess

def download_and_extract_surge():
    surge_url = "https://registry.npmjs.org/surge/-/surge-0.23.0.tgz"
    tar_path = "surge.tgz"
    extract_dir = "surge_pkg"
    
    if not os.path.exists(extract_dir):
        print("Downloading surge npm package...")
        urllib.request.urlretrieve(surge_url, tar_path)
        print("Extracting surge...")
        with tarfile.open(tar_path, "r:gz") as tar:
            tar.extractall(path=extract_dir)
        print("Surge extracted successfully!")
    
    surge_bin = os.path.abspath(os.path.join(extract_dir, "package", "lib", "cli.js"))
    return surge_bin

if __name__ == "__main__":
    surge_cli = download_and_extract_surge()
    node_exe = r"C:\Users\Karunesh P\AppData\Local\ms-playwright-go\1.57.0\node.exe"
    site_dir = r"c:\Users\Karunesh P\OneDrive\Desktop\PROXEND\bdayyy"
    
    domain = "diii-birthday-surprise.surge.sh"
    
    print(f"Deploying {site_dir} to https://{domain} using Surge...")
    cmd = [node_exe, surge_cli, site_dir, "--domain", domain]
    
    proc = subprocess.run(cmd, capture_output=True, text=True)
    print("Surge Output:")
    print(proc.stdout)
    print("Surge Error:")
    print(proc.stderr)
