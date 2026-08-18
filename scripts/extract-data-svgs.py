import json
from pathlib import Path
from urllib.parse import unquote

src = Path("/Users/apple/.cursor/browser-logs/cdp-response-Runtime.evaluate-2026-08-17T06-14-44-299Z.json")
data = json.loads(src.read_text())
val = data.get("result", {}).get("value") or data.get("value")
obj = json.loads(val) if isinstance(val, str) else val
out = Path("/Users/apple/Desktop/kainet_new/public/sites/www-twelvelabs-io-a368af44/root-8a5edab2/images")
n = 0
for url in obj.get("uniqueImgs", []):
    if not str(url).startswith("data:image/svg+xml"):
        continue
    payload = url.split(",", 1)[1]
    svg = unquote(payload)
    (out / f"inline-{n}.svg").write_text(svg)
    print(n, len(svg))
    n += 1
print("wrote", n)
