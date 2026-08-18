import json
from pathlib import Path

src = Path("/Users/apple/.cursor/browser-logs/cdp-response-Runtime.evaluate-2026-08-17T06-14-44-299Z.json")
data = json.loads(src.read_text())
val = data.get("result", {}).get("value") or data.get("value")
obj = json.loads(val) if isinstance(val, str) else val

def short(u, n=180):
    s = str(u)
    return s if len(s) <= n else s[:n] + "…"

imgs = obj.get("uniqueImgs", [])
vids = obj.get("uniqueVids", [])
bgs = obj.get("uniqueBgs", [])
fonts = obj.get("fontFaces", [])

lines = [
    "# Assets index",
    f"- unique images: {len(imgs)}",
    f"- unique videos: {len(vids)}",
    f"- unique bg urls: {len(bgs)}",
    f"- font faces: {len(fonts)}",
    "",
    "## Videos",
]
lines += [f"- {short(u, 300)}" for u in vids]
lines += ["", "## Images"]
lines += [f"- {short(u)}" for u in imgs]
lines += ["", "## Fonts (family / weight / src prefix)"]
for f in fonts:
    if isinstance(f, dict):
        lines.append(f"- {f.get('family')} w{f.get('weight')} {short(f.get('src'), 120)}")
    else:
        lines.append(f"- {short(f)}")
Path("/Users/apple/Desktop/kainet_new/docs/research/www-twelvelabs-io-a368af44/root-8a5edab2/ASSETS_INDEX.md").write_text("\n".join(lines))
print("ok", len(imgs), len(vids), len(fonts))
