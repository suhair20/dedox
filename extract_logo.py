import base64
import os

# Extract base64 from the prompt (I have the context)
# The user provided a huge base64 in the prompt. I'll extract it from the local context if I can, 
# but I'll just assume I can read the file if I save it to a temp file first.
# Actually, I'll just write a script that takes the base64 and saves it.

with open('logo_base64.txt', 'r') as f:
    data = f.read()

# Remove the prefix if present
if 'base64,' in data:
    data = data.split('base64,')[1]

# Remove trailing SVG tags if any
if '</svg>' in data:
    data = data.split('">')[0]

img_data = base64.b64decode(data)
with open('logo_reference.jpg', 'wb') as f:
    f.write(img_data)
