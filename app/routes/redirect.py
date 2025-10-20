from flask import Blueprint, redirect, abort
from app.models import URL
from app import db, cache

bp = Blueprint("redirect", __name__)

@bp.route("/<short_code>")
def redirect_url(short_code):
    # Check Redis first
    original_url = cache.get(short_code)

    if not original_url:
        url = URL.query.filter_by(short_code=short_code).first()
        if not url:
            abort(404)
        original_url = url.original_url
        cache.set(short_code, original_url)
    else:
        url = URL.query.filter_by(short_code=short_code).first()
    
    # Increment click count
    if url:
        url.click_count += 1
        db.session.commit()

    return redirect(original_url)
