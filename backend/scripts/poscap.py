# beach_cleanup_poster_from_mongodb.py
# Fetches event from MongoDB using event _id → generates poster → captions

import sys
import argparse
import os
import json
from datetime import datetime
import base64
from groq import Groq
from PIL import Image, ImageDraw, ImageFont
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import ConfigurationError, OperationFailure

# ────────────────────────────────────────────────
# CONFIG – IMPORTANT PARTS TO CHECK
# ────────────────────────────────────────────────

# MongoDB Atlas URI – copy EXACTLY from Atlas → Connect → Drivers
# Make sure username, password, cluster name are correct
MONGO_URI = "mongodb+srv://Aish_db_user:LrJG99R0AmhVFW7d@cluster0.rfxqjwx.mongodb.net/?retryWrites=true&w=majority"

DB_NAME    = "test"          # Must match your actual database name
COLLECTION = "events"        # Must match your collection name

# Template path – change to relative path when deploying
# For local testing, keep absolute path
TEMPLATE_PATH = r"C:\Users\Vansh\OneDrive\Desktop\dep\wastecleanup.png"

# If deploying to server → use:
# TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "templates", "wastecleanup.png")

# Groq API key
API_KEY = "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"
client = Groq(api_key=API_KEY)

# Styling (unchanged)
FONT_TITLE_SIZE    = 55
FONT_INVITE_SIZE   = 24
FONT_DETAILS_SIZE  = 32
FONT_SUB_SIZE      = 26

Y_TITLE       = 780
Y_INVITE      = 680
Y_DATE        = 480
Y_TIME        = 420
Y_LOCATION    = 360
Y_VOLUNTEERS  = 280

COLOR_TITLE      = (13,  64, 140)
COLOR_TEXT       = (26,  26,  26)
COLOR_VOLUNTEERS = (204, 26,  26)

INVITE_LINES = [
    "Join us in our mission to create a cleaner, greener,",
    "and more beautiful beach! We warmly invite you to",
    "participate in our cleanup drive, where we will unite",
    "to protect our ocean and coastline."
]

# ────────────────────────────────────────────────
# POSTER GENERATION
# ────────────────────────────────────────────────

def generate_poster_from_event(event):
    if not os.path.exists(TEMPLATE_PATH):
        print(f"ERROR: Template image not found → {TEMPLATE_PATH}")
        return None, "Template image missing"

    try:
        img = Image.open(TEMPLATE_PATH).convert("RGB")
        draw = ImageDraw.Draw(img)
        w, h = img.size

        # Load fonts
        try:
            font_title   = ImageFont.truetype("arialbd.ttf", FONT_TITLE_SIZE)
            font_invite  = ImageFont.truetype("arial.ttf",   FONT_INVITE_SIZE)
            font_details = ImageFont.truetype("arialbd.ttf", FONT_DETAILS_SIZE)
            font_sub     = ImageFont.truetype("arial.ttf",   FONT_SUB_SIZE)
        except Exception:
            font_title = font_invite = font_details = font_sub = ImageFont.load_default()
            print("WARNING: Using default font – text may look poor")

        def draw_centered_text(y_from_bottom, text, font, color):
            bbox = draw.textbbox((0, 0), text, font=font)
            text_w = bbox[2] - bbox[0]
            x = (w - text_w) // 2
            draw.text((x, h - y_from_bottom), text, font=font, fill=color)

        # ─── Draw ────────────────────────────────────────────────
        title = event.get("name", "BEACH CLEANUP DRIVE").upper()
        draw_centered_text(Y_TITLE, title, font_title, COLOR_TITLE)

        y = Y_INVITE
        for line in INVITE_LINES:
            draw_centered_text(y, line, font_invite, COLOR_TEXT)
            y -= 32

        # Date parsing (robust)
        raw_date = event.get("date", "")
        try:
            if isinstance(raw_date, str):
                if "T" in raw_date:
                    dt = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
                else:
                    dt = datetime.strptime(raw_date.split("T")[0], "%Y-%m-%d")
                event_date_str = dt.strftime("%B %d, %Y")
            else:
                event_date_str = "Date TBD"
        except Exception:
            event_date_str = raw_date or "Date TBD"

        draw_centered_text(Y_DATE,     event_date_str,          font_details, COLOR_TITLE)
        draw_centered_text(Y_TIME,     event.get("time", "10:00 AM"),     font_sub, COLOR_TEXT)
        draw_centered_text(Y_LOCATION, event.get("location", "Mumbai"),   font_sub, COLOR_TEXT)

        vol = event.get("volunteersRequired", "?")
        vol_text = f"Volunteers Required: {vol}"
        draw_centered_text(Y_VOLUNTEERS, vol_text, font_details, COLOR_VOLUNTEERS)

        # Save
        os.makedirs("posters", exist_ok=True)
        safe_name = "".join(c if c.isalnum() else "_" for c in title)[:30]
        filename = f"poster_{safe_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        save_path = os.path.join("posters", filename)
        img.save(save_path, "PNG", quality=92)

        print(f"POSTER_CREATED:{os.path.abspath(save_path)}")
        return save_path, None

    except Exception as e:
        print(f"POSTER_FAILED:{str(e)}")
        return None, str(e)

# ────────────────────────────────────────────────
# CAPTIONS (unchanged – but added timeout)
# ────────────────────────────────────────────────

def encode_image(image_path):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode('utf-8')

def generate_platform_caption(image_base64, platform):
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
        )
    }

    try:
        response = client.chat.completions.create(
            model="llama-3.2-11b-vision-instruct",
            messages=[
                {"role": "user", "content": [
                    {"type": "text", "text": prompts.get(platform, prompts["Instagram"])},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_base64}"}}
                ]}
            ],
            temperature=0.7,
            max_tokens=320,
            timeout=45
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"[Error – {platform}]: {str(e)}"

# ────────────────────────────────────────────────
# MAIN – CLI MODE
# ────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Generate poster from MongoDB event")
    parser.add_argument("--event-id", required=True, help="MongoDB _id (24-char hex string)")
    args = parser.parse_args()

    print(f"Received event-id: {args.event_id!r}")

    # ─── Connect to MongoDB ──────────────────────────────────────────────
    try:
        client_mongo = MongoClient(MONGO_URI)
        # Test connection
        client_mongo.admin.command('ping')
        print("MongoDB connection OK")

        db = client_mongo[DB_NAME]
        print(f"Database: {DB_NAME}")
        print("Collections:", db.list_collection_names())

        collection = db[COLLECTION]
        print(f"Querying collection: {COLLECTION}")

        # Try ObjectId first (most common)
        try:
            event = collection.find_one({"_id": ObjectId(args.event_id)})
        except Exception as oid_err:
            print(f"ObjectId conversion failed: {oid_err}")
            event = None

        # Fallback: try as plain string
        if not event:
            print("Trying _id as string...")
            event = collection.find_one({"_id": args.event_id})

        if not event:
            print(f"ERROR: No event found with _id = {args.event_id}")
            print("Check:")
            print("  1. Event exists in database?")
            print("  2. Correct database name?")
            print("  3. Correct collection name?")
            print("  4. Correct MongoDB URI / credentials?")
            sys.exit(1)

        print("EVENT_FOUND:", json.dumps(event, default=str, indent=2))

    except ConfigurationError as ce:
        print(f"MONGO_CONFIG_ERROR: {ce}")
        sys.exit(1)
    except OperationFailure as of:
        print(f"MONGO_AUTH_ERROR: {of}")
        sys.exit(1)
    except Exception as e:
        print(f"MONGO_CONNECTION_ERROR: {str(e)}")
        sys.exit(1)

    # ─── Generate poster ─────────────────────────────────────────────────
    poster_path, error = generate_poster_from_event(event)

    if error or not poster_path:
        print(f"POSTER_FAILED:{error}")
        sys.exit(1)

    # ─── Generate captions ───────────────────────────────────────────────
    try:
        base64_img = encode_image(poster_path)

        captions = {
            "Instagram": generate_platform_caption(base64_img, "Instagram"),
            "Facebook" : generate_platform_caption(base64_img, "Facebook"),
            "LinkedIn" : generate_platform_caption(base64_img, "LinkedIn"),
        }

        print("CAPTIONS:")
        print(json.dumps(captions, indent=2, ensure_ascii=False))

        print(f"POSTER_PATH:{os.path.abspath(poster_path)}")

    except Exception as e:
        print(f"CAPTIONS_FAILED:{str(e)}")


if __name__ == "__main__":
    main()