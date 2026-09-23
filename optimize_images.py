import os
from PIL import Image

img_dir = r"c:\Users\Karunesh P\OneDrive\Desktop\PROXEND\bdayyy\assets\images"

for filename in os.listdir(img_dir):
    if filename.endswith('.jpg') or filename.endswith('.jpeg') or filename.endswith('.png'):
        filepath = os.path.join(img_dir, filename)
        try:
            with Image.open(filepath) as img:
                img = img.convert('RGB')
                # Resize if width or height > 1200px
                img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                img.save(filepath, 'JPEG', quality=82, optimize=True)
                print(f"Optimized {filename}: {os.path.getsize(filepath)} bytes")
        except Exception as e:
            print(f"Error optimizing {filename}: {e}")
