import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {"sslmode": "require"},
        "pool_pre_ping": False,
        # tune pool_size / max_overflow for your workload
        # "pool_size": 5,
        # "max_overflow": 10,
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
