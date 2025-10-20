from flask import Blueprint, request, jsonify
from app import db
from app.models import URL
from app.utils.shortener import encode
from app import cache

bp = Blueprint("shorten", __name__, url_prefix="/api")

@bp.route("/shorten", methods=["POST"])
def shorten_url():
    data = request.get_json()
    original_url = data.get("url")

    if not original_url:
        return jsonify({"error": "URL is required"}), 400

    # Save to database
    new_url = URL(original_url=original_url, short_code="temp")
    db.session.add(new_url)
    db.session.commit()

    # Generate short code using the ID
    new_url.short_code = encode(new_url.id)
    db.session.commit()

    # Cache the mapping in Redis
    cache.set(new_url.short_code, original_url)

    short_url = request.host_url + new_url.short_code
    return jsonify({short_url: short_url}), 201

@bp.route("/shorten/hello", methods=["GET"])
def greeting():
    return jsonify({"message": "Hello! Welcome to our api"})