from flask import Blueprint, request, jsonify, url_for
from flask_cors import CORS

from urllib.parse import urlparse
from pathlib import Path 

from services.gpt_service import imgfile_tblsextrt
from services.pdf_service import save_pdf, pdf_to_images


api_bp = Blueprint("api", __name__)
CORS(api_bp)                    # allow localhost:5173 to talk to us

BASE_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BASE_DIR / "uploads"
STATIC_DIR  = BASE_DIR / "static"
PAGES_DIR   = STATIC_DIR / "pages"

@api_bp.route("/gpt", methods=["POST"])
def gpt():
    data = request.get_json()
    url = data.get("img_path")

    if not url:
        return jsonify({"error": "img_path not provided"}), 400

    # Convert full URL to relative path (static/pages/...)
    rel_path = urlparse(url).path.lstrip("/")
    img_path = Path(rel_path)

    print(img_path)

    if not img_path:
        return jsonify({"error": "img_path not provided"}), 400

    try:
        # Customize prompt and model
        user_prompt = "Extract all tables from this image and return in structured JSON format."
        model = "o4-mini"  # or "o4-mini" if that's what you're testing
        output_json_path = "output.json"  # optional temp file, unused in your code

        response_dict, token_usage = imgfile_tblsextrt(
            img_path=img_path,
            output_json_path=output_json_path,
            user_prompt=user_prompt,
            model_used=model
        )

        return jsonify({
            "tables": response_dict,
            "token_usage": token_usage
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "file missing"}), 400

    f = request.files["file"]
    upload_id, name, pdf_path = save_pdf(f, UPLOADS_DIR)

    out_dir = PAGES_DIR / upload_id
    paths = pdf_to_images(pdf_path, out_dir)

    # Build absolute URLs so React can load them
    urls = [
        url_for("static", filename=f"pages/{upload_id}/{p.name}", _external=True)
        for p in paths
    ]

    return jsonify({
        "name": name,
        "upload_id": upload_id,
        "thumbnails": urls   # keep the same key your UI already uses
    })

