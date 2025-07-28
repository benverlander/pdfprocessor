# backend/services/pdf_service.py
from pathlib import Path
from uuid import uuid4
from werkzeug.utils import secure_filename
import fitz  # PyMuPDF

def save_pdf(file_storage, uploads_dir: Path):
    uploads_dir.mkdir(parents=True, exist_ok=True)
    upload_id = uuid4().hex
    filename = secure_filename(file_storage.filename)
    out_path = uploads_dir / f"{upload_id}_{filename}"
    file_storage.save(out_path)
    return upload_id, filename, out_path

def pdf_to_images(pdf_path: Path, out_dir: Path, scale: float = 2.0):
    """
    Render each page to a PNG and return a list of Path objects.
    scale=2.0 ~ 144 dpi preview.
    """
    out_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    mat = fitz.Matrix(scale, scale)

    images = []
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=mat, alpha=False)
        out_file = out_dir / f"page_{i+1:04d}.png"
        pix.save(out_file)
        images.append(out_file)
    doc.close()
    return images
