from flask import Blueprint, jsonify
from app.models import URL

bp = Blueprint("stats", __name__, url_prefix="/api")

@bp.route("/stats/<short_code>", methods=["GET"])
def get_stats(short_code):
    url = URL.query.filter_by(short_code=short_code).first()
    if not url:
        return jsonify({"error": "URL not found"}), 404

    return jsonify({
        "original_url": url.original_url,
        "short_code": url.short_code,
        "click_count": url.click_count,
        "created_at": url.created_at.isoformat(),
    })
