import sys
import argparse
import os
import json
from datetime import datetime
import base64
from groq import Groq
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import ConfigurationError, OperationFailure

# ────────────────────────────────────────────────
# CONFIG
# ────────────────────────────────────────────────

MONGO_URI  = "mongodb+srv://Aish_db_user:LrJG99R0AmhVFW7d@cluster0.rfxqjwx.mongodb.net/?retryWrites=true&w=majority"
DB_NAME    = "test"
COLLECTION = "events"

# Path to your nature/leaf background image (the dark green fern template)
# Set this to your actual image path; it is embedded as base64 into the HTML.
# If left empty, a CSS gradient fallback is used instead.
TEMPLATE_IMAGE_PATH = r"D:\4th Year Mini project\Vansh Swachmitra\SwachhMitra\backend\scripts\wastecleanup.png"

# Groq API key
API_KEY = "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"
client = Groq(api_key=API_KEY)

INVITE_LINES = [
    "Join us in our mission to create a cleaner, greener,",
    "and more beautiful beach! We warmly invite you to",
    "participate in our cleanup drive, where we will unite",
    "to protect our ocean and coastline.",
]

# ────────────────────────────────────────────────
# HTML / CSS POSTER GENERATION
# ────────────────────────────────────────────────

def _embed_image_as_base64(path: str) -> str | None:
    """Return a data-URI for the background image, or None if unavailable."""
    if not path or not os.path.exists(path):
        return None
    ext = os.path.splitext(path)[1].lower().lstrip(".")
    mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg",
            "png": "image/png",  "webp": "image/webp"}.get(ext, "image/png")
    with open(path, "rb") as fh:
        b64 = base64.b64encode(fh.read()).decode()
    return f"data:{mime};base64,{b64}"


def generate_poster_html(event: dict) -> tuple[str | None, str | None]:
    """
    Renders the poster as a self-contained HTML file that mirrors
    the dark-green nature template aesthetic shown in the screenshot.
    Returns (html_file_path, error_string).
    """
    # ── Event fields ──────────────────────────────────────────────────────
    title = event.get("name", "BEACH CLEANUP DRIVE").upper()

    raw_date = event.get("date", "")
    try:
        if isinstance(raw_date, str) and raw_date:
            dt_str = raw_date.replace("Z", "+00:00")
            dt = datetime.fromisoformat(dt_str) if "T" in dt_str else \
                 datetime.strptime(raw_date[:10], "%Y-%m-%d")
            event_date_str = dt.strftime("%B %d, %Y")
        else:
            event_date_str = "Date TBD"
    except Exception:
        event_date_str = str(raw_date) or "Date TBD"

    event_time     = event.get("time", "10:00 AM")
    event_location = event.get("location", "Mumbai")
    volunteers     = event.get("volunteersRequired", "?")

    # ── Background ────────────────────────────────────────────────────────
    bg_data_uri = _embed_image_as_base64(TEMPLATE_IMAGE_PATH)
    if bg_data_uri:
        bg_css = f"background-image: url('{bg_data_uri}'); background-size: cover; background-position: center;"
    else:
        # Fallback: rich dark-green CSS gradient that matches the template mood
        bg_css = (
            "background: radial-gradient(ellipse at 60% 30%, #0d3320 0%, #061a0f 40%, #020d07 100%),"
            "url(\"data:image/svg+xml,%3Csvg width='600' height='800' xmlns='http://www.w3.org/2000/svg'%3E"
            "%3Ccircle cx='300' cy='300' r='280' fill='%230a2a18' opacity='0.6'/%3E%3C/svg%3E\") center/cover;"
        )

    invite_html = "".join(f"<p>{line}</p>" for line in INVITE_LINES)

    # ── HTML Template ─────────────────────────────────────────────────────
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>{title} – Poster</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet"/>

<style>
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

  :root {{
    --white:       #ffffff;
    --offwhite:    #e8efe8;
    --accent:      #a8d8a8;
    --gold:        #c9a84c;
    --dark-green:  #0d3320;
    --deep:        #020d07;
    --card-w:      520px;
    --card-h:      740px;
  }}

  body {{
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #020d07;
    font-family: 'Montserrat', sans-serif;
  }}

  /* ── Poster card ─────────────────────────────────────────── */
  .poster {{
    position: relative;
    width:  var(--card-w);
    height: var(--card-h);
    overflow: hidden;
    border-radius: 18px;
    box-shadow: 0 30px 80px rgba(0,0,0,.8), 0 0 0 1px rgba(168,216,168,.12);
    {bg_css}
  }}

  /* dark vignette overlay so text is always readable */
  .poster::before {{
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 50% 0%,   transparent 40%, rgba(2,13,7,.55) 100%),
      linear-gradient(to bottom, rgba(2,13,7,.10) 0%, rgba(2,13,7,.15) 45%, rgba(2,13,7,.82) 68%, rgba(2,13,7,.97) 100%);
    z-index: 1;
  }}

  /* subtle green shimmer top-right */
  .poster::after {{
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(40,120,60,.18) 0%, transparent 70%);
    z-index: 1;
    pointer-events: none;
  }}

  /* ── Content layer ───────────────────────────────────────── */
  .content {{
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 38px 42px;
  }}

  /* decorative thin top bar */
  .top-bar {{
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: .5;
  }}

  /* ── Script headline ──────────────────────────────────────── */
  .headline {{
    font-family: 'Dancing Script', cursive;
    font-size: 68px;
    line-height: 1;
    color: var(--white);
    letter-spacing: -1px;
    text-shadow: 0 2px 20px rgba(0,0,0,.6);
    margin-bottom: 2px;
  }}
  .headline span {{
    color: var(--accent);
  }}

  /* ── Event title (all-caps) ──────────────────────────────── */
  .event-title {{
    font-family: 'Montserrat', sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 4px;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 14px;
  }}

  /* ── Divider ─────────────────────────────────────────────── */
  .divider {{
    width: 44px;
    height: 2px;
    background: var(--accent);
    margin-bottom: 16px;
    opacity: .7;
  }}

  /* ── Invite copy ─────────────────────────────────────────── */
  .invite {{
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 300;
    font-size: 14.5px;
    line-height: 1.7;
    color: rgba(232,239,232,.78);
    margin-bottom: 20px;
  }}
  .invite p {{ margin: 0; }}

  /* ── Details grid ────────────────────────────────────────── */
  .details {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 18px;
    margin-bottom: 22px;
  }}
  .detail-item {{
    display: flex;
    flex-direction: column;
    gap: 2px;
  }}
  .detail-label {{
    font-size: 9px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--accent);
    opacity: .7;
  }}
  .detail-value {{
    font-size: 15px;
    font-weight: 600;
    color: var(--white);
    letter-spacing: .3px;
  }}

  /* ── Volunteers banner ───────────────────────────────────── */
  .volunteers {{
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(201,168,76,.13);
    border: 1px solid rgba(201,168,76,.35);
    border-radius: 6px;
    padding: 9px 16px;
    color: var(--gold);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: .8px;
  }}
  .volunteers svg {{
    flex-shrink: 0;
  }}
</style>
</head>
<body>
<div class="poster">
  <div class="top-bar"></div>

  <div class="content">
    <!-- Script header that mirrors "Nature." from template -->
    <div class="headline">Nature<span>.</span></div>

    <!-- Event title sits right below in uppercase tracking -->
    <div class="event-title">{title}</div>

    <div class="divider"></div>

    <!-- Invite copy -->
    <div class="invite">
      {invite_html}
    </div>

    <!-- Date / Time / Location / Volunteers -->
    <div class="details">
      <div class="detail-item">
        <span class="detail-label">Date</span>
        <span class="detail-value">{event_date_str}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Time</span>
        <span class="detail-value">{event_time}</span>
      </div>
      <div class="detail-item" style="grid-column: 1 / -1;">
        <span class="detail-label">Location</span>
        <span class="detail-value">{event_location}</span>
      </div>
    </div>

    <div class="volunteers">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      Volunteers Required: {volunteers}
    </div>
  </div>
</div>
</body>
</html>
"""

    # ── Save ──────────────────────────────────────────────────────────────
    try:
        os.makedirs("posters", exist_ok=True)
        safe_name  = "".join(c if c.isalnum() else "_" for c in title)[:30]
        filename   = f"poster_{safe_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
        save_path  = os.path.join("posters", filename)

        with open(save_path, "w", encoding="utf-8") as fh:
            fh.write(html)

        abs_path = os.path.abspath(save_path)
        print(f"POSTER_CREATED:{abs_path}")
        return abs_path, None

    except Exception as e:
        err = str(e)
        print(f"POSTER_FAILED:{err}")
        return None, err


# ────────────────────────────────────────────────
# CAPTIONS  (unchanged logic, still uses Groq vision)
# ────────────────────────────────────────────────

def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def generate_platform_caption(image_base64: str, platform: str) -> str:
    prompts = {
        "Instagram": (
            "This is a promotional beach cleanup event poster. "
            "Create a short, vibrant Instagram caption that promotes this event. "
            "Use positive, energetic tone. Include 4–6 relevant emojis. "
            "Highlight community, ocean protection, call to join. "
            "End with 7–10 hashtags like #BeachCleanup #CleanSeas #OceanLovers #MumbaiCleanup"
        ),
        "Facebook": (
            "This is a beach cleanup drive poster. Write an engaging Facebook caption. "
            "Mention purpose, date, time, place, volunteers needed. "
            "Add emotional appeal. Encourage joining/sharing. End with question."
        ),
        "LinkedIn": (
            "This is a professional beach cleanup poster. "
            "Create a polished LinkedIn post. Focus on environment, community, SDG 14. "
            "Include event details. Call to action for professionals/students/companies."
        ),
    }

    try:
        response = client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text",      "text": prompts.get(platform, prompts["Instagram"])},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_base64}"}},
                ],
            }],
            temperature=0.7,
            max_tokens=320,
            timeout=45,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"[Error – {platform}]: {e}"


# ────────────────────────────────────────────────
# MAIN
# ────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Generate HTML poster from MongoDB event")
    parser.add_argument("--event-id", required=True, help="MongoDB _id (24-char hex)")
    args = parser.parse_args()

    print(f"Received event-id: {args.event_id!r}")

    # ── MongoDB ───────────────────────────────────────────────────────────
    try:
        client_mongo = MongoClient(MONGO_URI)
        client_mongo.admin.command("ping")
        print("MongoDB connection OK")

        db         = client_mongo[DB_NAME]
        collection = db[COLLECTION]
        print(f"Collections: {db.list_collection_names()}")

        try:
            event = collection.find_one({"_id": ObjectId(args.event_id)})
        except Exception as oid_err:
            print(f"ObjectId conversion failed: {oid_err}")
            event = None

        if not event:
            print("Trying _id as plain string...")
            event = collection.find_one({"_id": args.event_id})

        if not event:
            print(f"ERROR: No event found with _id = {args.event_id}")
            sys.exit(1)

        print("EVENT_FOUND:", json.dumps(event, default=str, indent=2))

    except ConfigurationError as ce:
        print(f"MONGO_CONFIG_ERROR: {ce}")
        sys.exit(1)
    except OperationFailure as of:
        print(f"MONGO_AUTH_ERROR: {of}")
        sys.exit(1)
    except Exception as e:
        print(f"MONGO_CONNECTION_ERROR: {e}")
        sys.exit(1)

    # ── Generate HTML poster ──────────────────────────────────────────────
    poster_path, error = generate_poster_html(event)

    if error or not poster_path:
        print(f"POSTER_FAILED:{error}")
        sys.exit(1)

    # ── Captions ─────────────────────────────────────────────────────────
    # NOTE: Groq vision expects an actual rendered image (PNG/JPEG).
    # If you have `playwright` or `selenium` installed you can render the HTML
    # to PNG first, then pass it below.  For now we skip captions when no
    # screenshot tool is available and note the HTML path instead.
    screenshot_path = poster_path.replace(".html", ".png")

    try:
        # ── Optional: render HTML → PNG via Playwright ────────────────────
        # pip install playwright && playwright install chromium
        from playwright.sync_api import sync_playwright  # type: ignore

        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            page    = browser.new_page(viewport={"width": 520, "height": 740})
            page.goto(f"file:///{poster_path.replace(os.sep, '/')}")
            page.locator(".poster").screenshot(path=screenshot_path)
            browser.close()

        print(f"SCREENSHOT_CREATED:{os.path.abspath(screenshot_path)}")
        caption_image = screenshot_path

    except ImportError:
        print(
            "INFO: `playwright` not installed – skipping PNG screenshot.\n"
            "      Run `pip install playwright && playwright install chromium` to enable.\n"
            f"      HTML poster saved at: {poster_path}"
        )
        caption_image = None

    except Exception as e:
        print(f"SCREENSHOT_FAILED:{e}")
        caption_image = None

    if caption_image and os.path.exists(caption_image):
        try:
            b64 = encode_image(caption_image)
            captions = {
                "Instagram": generate_platform_caption(b64, "Instagram"),
                "Facebook":  generate_platform_caption(b64, "Facebook"),
                "LinkedIn":  generate_platform_caption(b64, "LinkedIn"),
            }
            print("CAPTIONS:")
            print(json.dumps(captions, indent=2, ensure_ascii=False))
        except Exception as e:
            print(f"CAPTIONS_FAILED:{e}")

    # print(f"POSTER_PATH:{os.path.abspath(poster_path)}")
    
    # ✅ Prepare PNG path safely
    png_path = None
    if 'caption_image' in locals() and caption_image and os.path.exists(caption_image):
        png_path = os.path.abspath(caption_image)

    # ✅ Create output object
    output = {
        "html": os.path.abspath(poster_path),
        "png": png_path
    }

    # ✅ Send both paths
    print("POSTER_OUTPUT:" + json.dumps(output))
    

    


if __name__ == "__main__":
    main()