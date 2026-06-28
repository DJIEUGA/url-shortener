import uuid
from datetime import datetime, timezone
from app import db


class URL(db.Model):
    __tablename__ = "urls"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    original_url = db.Column(db.String(512), nullable=False)
    alias = db.Column(db.String(10), unique=True, nullable=False)
    transformation_type = db.Column(db.String(20), nullable=False, default="Shorten")
    clicks = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="Active")

    def to_dict(self, app_domain: str) -> dict:
        return {
            "id": self.id,
            "originalUrl": self.original_url,
            "transformedUrl": f"{app_domain}/{self.alias}",
            "alias": self.alias,
            "transformationType": self.transformation_type,
            "clicks": self.clicks,
            "createdAt": self.created_at.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
            "status": self.status,
        }

    def __repr__(self):
        return f"<URL {self.alias}>"
