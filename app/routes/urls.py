import os
from urllib.parse import urlparse
from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models import URL
from app.utils.shortener import generate_alias

bp = Blueprint("urls", __name__, url_prefix="/api/urls")

MAX_ALIAS_RETRIES = 10


def _app_domain() -> str:
    return current_app.config.get("APP_DOMAIN", "http://localhost:5000").rstrip("/")


def _is_valid_url(value: str) -> bool:
    try:
        parsed = urlparse(value)
        return parsed.scheme in ("http", "https") and bool(parsed.netloc)
    except Exception:
        return False


@bp.route("", methods=["GET"])
def list_urls():
    urls = URL.query.order_by(URL.created_at.desc()).all()
    return jsonify([u.to_dict(_app_domain()) for u in urls]), 200


@bp.route("", methods=["POST"])
def create_url():
    data = request.get_json(silent=True) or {}

    original_url = data.get("originalUrl", "").strip()
    transformation_type = data.get("transformationType", "").strip()

    if not original_url:
        return jsonify({"error": "originalUrl is required"}), 400
    if not _is_valid_url(original_url):
        return jsonify({"error": "originalUrl must be a valid http or https URL"}), 400
    if transformation_type != "Shorten":
        return jsonify({"error": "transformationType must be \"Shorten\""}), 400

    for _ in range(MAX_ALIAS_RETRIES):
        alias = generate_alias()
        if not URL.query.filter_by(alias=alias).first():
            break
    else:
        return jsonify({"error": "Could not generate a unique alias, please try again"}), 500

    url = URL(original_url=original_url, alias=alias, transformation_type="Shorten")
    db.session.add(url)
    db.session.commit()

    return jsonify(url.to_dict(_app_domain())), 201


@bp.route("/<string:url_id>", methods=["DELETE"])
def delete_url(url_id):
    url = URL.query.get(url_id)
    if not url:
        return jsonify({"error": "URL not found"}), 404

    db.session.delete(url)
    db.session.commit()
    return "", 204
