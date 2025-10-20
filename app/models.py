from datetime import datetime
from app import db

class URL(db.Model):
    __tablename__ = "urls"

    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(512), nullable=False)
    short_code = db.Column(db.String(10), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    click_count = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"<URL {self.short_code}>"
