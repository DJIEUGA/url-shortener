from flask import Blueprint, redirect, jsonify
from app.models import URL
from app import db

bp = Blueprint("redirect", __name__)


@bp.route("/<string:alias>")
def redirect_url(alias):
    url = URL.query.filter_by(alias=alias).first()
    if not url:
        return jsonify({"error": "URL not found"}), 404

    url.clicks += 1
    db.session.commit()

    return redirect(url.original_url, code=302)
