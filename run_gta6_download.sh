#!/usr/bin/env bash
set -Eeuo pipefail

BASE_DIR="${BASE_DIR:-/var/www/ishoil_portfolio}"
DOMAIN="${DOMAIN:-ishoil.me}"
SOURCE_URL="${SOURCE_URL:-https://media.rockstargames.com/VI/downloads/videos/GTAVI_Videos.zip}"
WEB_SUBDIR="${WEB_SUBDIR:-downloads/gta6}"
KEEP_ZIP="${KEEP_ZIP:-1}"

log()  { printf '\n\033[1;36m[%s]\033[0m %s\n' "$(date '+%F %T')" "$*"; }
warn() { printf '\n\033[1;33m[WARNING]\033[0m %s\n' "$*" >&2; }
die()  { printf '\n\033[1;31m[ERROR]\033[0m %s\n' "$*" >&2; exit 1; }

[[ "$(id -u)" -eq 0 ]] || die "Run this script as root."
[[ -d "$BASE_DIR" ]] || die "Base directory does not exist: $BASE_DIR"

if [[ -n "${WEB_ROOT:-}" ]]; then
  PUBLIC_DIR="$WEB_ROOT"
elif [[ -d "$BASE_DIR/public" ]]; then
  PUBLIC_DIR="$BASE_DIR/public"
elif [[ -d "$BASE_DIR/dist" ]]; then
  PUBLIC_DIR="$BASE_DIR/dist"
elif [[ -d "$BASE_DIR/build" ]]; then
  PUBLIC_DIR="$BASE_DIR/build"
else
  PUBLIC_DIR="$BASE_DIR"
  warn "No public/, dist/, or build/ directory found. Using $BASE_DIR as web root."
fi

DEST_DIR="$PUBLIC_DIR/$WEB_SUBDIR"
FILES_DIR="$DEST_DIR/files"
ZIP_PATH="$DEST_DIR/GTAVI_Videos.zip"
PART_PATH="$DEST_DIR/GTAVI_Videos.zip.part"
PUBLIC_URL="https://$DOMAIN/$WEB_SUBDIR/"

log "Selected web root: $PUBLIC_DIR"
log "Destination: $DEST_DIR"
log "Public URL: $PUBLIC_URL"

mkdir -p "$DEST_DIR" "$FILES_DIR"

AVAILABLE_KB="$(df -Pk "$DEST_DIR" | awk 'NR==2 {print $4}')"
REQUIRED_KB=$((5 * 1024 * 1024))
(( AVAILABLE_KB >= REQUIRED_KB )) || die "Less than 5 GiB free space is available."

export DEBIAN_FRONTEND=noninteractive

if ! command -v curl >/dev/null 2>&1 || \
   ! command -v unzip >/dev/null 2>&1 || \
   ! command -v python3 >/dev/null 2>&1; then
  log "Installing dependencies"
  apt-get update -y
  apt-get install -y curl unzip python3 coreutils ca-certificates
fi

if ! command -v aria2c >/dev/null 2>&1; then
  log "Installing aria2"
  apt-get update -y
  apt-get install -y aria2
fi

log "Checking Rockstar URL"
curl -L --fail --silent --show-error \
  --connect-timeout 30 --max-time 120 \
  --retry 5 --retry-all-errors \
  --range 0-1023 \
  -o /dev/null "$SOURCE_URL" \
  || die "The server cannot reach the Rockstar download URL."

log "Downloading with resume support"
rm -f "$PART_PATH.aria2"

aria2c \
  --continue=true \
  --allow-overwrite=true \
  --auto-file-renaming=false \
  --file-allocation=none \
  --max-connection-per-server=8 \
  --split=8 \
  --min-split-size=8M \
  --connect-timeout=30 \
  --timeout=60 \
  --max-tries=20 \
  --retry-wait=5 \
  --check-certificate=true \
  --user-agent="Mozilla/5.0" \
  --dir="$DEST_DIR" \
  --out="$(basename "$PART_PATH")" \
  "$SOURCE_URL"

[[ -s "$PART_PATH" ]] || die "Downloaded file is empty."
mv -f "$PART_PATH" "$ZIP_PATH"

log "Testing ZIP integrity"
unzip -tq "$ZIP_PATH" >/dev/null || die "ZIP integrity test failed."

log "Extracting videos"
rm -rf "$FILES_DIR"
mkdir -p "$FILES_DIR"
unzip -oq "$ZIP_PATH" -d "$FILES_DIR"

VIDEO_COUNT="$(find "$FILES_DIR" -type f \( \
  -iname '*.mp4' -o -iname '*.mov' -o -iname '*.m4v' -o \
  -iname '*.webm' -o -iname '*.mkv' \
\) | wc -l | tr -d ' ')"

(( VIDEO_COUNT > 0 )) || die "No video files found after extraction."
log "Found $VIDEO_COUNT video file(s)"

if [[ "$KEEP_ZIP" != "1" ]]; then
  rm -f "$ZIP_PATH"
fi

log "Generating manifest and download page"
export DEST_DIR FILES_DIR PUBLIC_URL ZIP_PATH KEEP_ZIP

python3 <<'PY'
import hashlib
import html
import json
import mimetypes
import os
from pathlib import Path
from urllib.parse import quote
from datetime import datetime, timezone

dest = Path(os.environ["DEST_DIR"]).resolve()
files_dir = Path(os.environ["FILES_DIR"]).resolve()
public_url = os.environ["PUBLIC_URL"].rstrip("/") + "/"
keep_zip = os.environ.get("KEEP_ZIP", "1") == "1"
zip_path = Path(os.environ["ZIP_PATH"]).resolve()

video_exts = {".mp4", ".mov", ".m4v", ".webm", ".mkv"}

def sha256(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(8 * 1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()

def human_size(value):
    size = float(value)
    for unit in ("B", "KB", "MB", "GB", "TB"):
        if size < 1024 or unit == "TB":
            return f"{size:.2f} {unit}"
        size /= 1024

entries = []
for path in sorted(files_dir.rglob("*")):
    if not path.is_file() or path.suffix.lower() not in video_exts:
        continue
    rel = path.relative_to(dest).as_posix()
    entries.append({
        "filename": path.name,
        "relative_path": rel,
        "download_url": public_url + quote(rel, safe="/"),
        "size_bytes": path.stat().st_size,
        "mime_type": mimetypes.guess_type(path.name)[0] or "application/octet-stream",
        "sha256": sha256(path),
    })

package = None
if keep_zip and zip_path.exists():
    rel = zip_path.relative_to(dest).as_posix()
    package = {
        "filename": zip_path.name,
        "relative_path": rel,
        "download_url": public_url + quote(rel, safe="/"),
        "size_bytes": zip_path.stat().st_size,
        "mime_type": "application/zip",
        "sha256": sha256(zip_path),
    }

manifest = {
    "source": "Rockstar Games official GTA VI media page",
    "source_url": "https://www.rockstargames.com/VI/media/videos",
    "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    "package": package,
    "video_count": len(entries),
    "videos": entries,
}

(dest / "manifest.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2),
    encoding="utf-8",
)

rows = []
if package:
    rows.append(
        '<li class="package"><a href="' +
        html.escape(package["relative_path"]) +
        '" download>Download complete official ZIP</a><span>' +
        human_size(package["size_bytes"]) +
        '</span></li>'
    )

for item in entries:
    rows.append(
        '<li><a href="' +
        html.escape(item["relative_path"]) +
        '" download>' +
        html.escape(item["filename"]) +
        '</a><span>' +
        human_size(item["size_bytes"]) +
        '</span></li>'
    )

page_parts = [
    '<!doctype html>',
    '<html lang="en"><head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta name="robots" content="noindex,nofollow">',
    '<title>GTA VI Official Video Files</title>',
    '<style>',
    'body{margin:0;background:#111;color:#eee;font-family:system-ui,sans-serif}',
    'main{max-width:920px;margin:48px auto;padding:0 20px}',
    'p{color:#bbb;line-height:1.6} ul{list-style:none;padding:0}',
    'li{display:flex;justify-content:space-between;gap:20px;padding:15px 16px;margin:10px 0;border:1px solid #333;border-radius:10px;background:#181818}',
    'li.package{border-color:#777} a{color:#fff;overflow-wrap:anywhere}',
    'span{color:#aaa;white-space:nowrap} footer{margin-top:28px;color:#888;font-size:14px}',
    '</style></head><body><main>',
    '<h1>GTA VI official video files</h1>',
    f'<p>{len(entries)} video file(s) downloaded from the official Rockstar media package.</p>',
    '<ul>',
    ''.join(rows),
    '</ul>',
    '<p><a href="manifest.json">Open manifest.json</a></p>',
    '<footer>Private working asset page. Not indexed by search engines.</footer>',
    '</main></body></html>',
]

(dest / "index.html").write_text("\n".join(page_parts), encoding="utf-8")
(dest / "robots.txt").write_text("User-agent: *\nDisallow: /\n", encoding="utf-8")
PY

find "$DEST_DIR" -type d -exec chmod 755 {} +
find "$DEST_DIR" -type f -exec chmod 644 {} +
chmod o+x "$BASE_DIR" "$PUBLIC_DIR" 2>/dev/null || true

log "Files are ready"
printf '%s\n' \
  "Directory: $DEST_DIR" \
  "Page:      $PUBLIC_URL" \
  "Manifest:  ${PUBLIC_URL}manifest.json"

log "Testing public URL"
if curl -L --fail --silent --show-error \
  --connect-timeout 20 --max-time 60 \
  -o /dev/null "$PUBLIC_URL"; then
  printf '\n\033[1;32mSUCCESS\033[0m: %s\n' "$PUBLIC_URL"
else
  warn "Download completed, but this path is not currently served by the website."
  cat <<EOF

Run and send me the output of:
  ls -lah "$DEST_DIR"
  nginx -T 2>/dev/null | grep -nE 'server_name|root |proxy_pass' | head -80
  curl -I "https://$DOMAIN/"

If ishoil.me uses another public directory, rerun with:
  WEB_ROOT=/correct/public/path bash $0

The completed ZIP will be reused/resumed; it will not start from zero.
EOF
fi
