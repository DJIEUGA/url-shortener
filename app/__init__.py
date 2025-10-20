from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import redis
import os
from dotenv import load_dotenv

# Load env variables
load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
cache = None  # Redis instance

def create_app():
    app = Flask(__name__)
    
    # Config
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # global cache
    # cache = redis.Redis.from_url(os.getenv("REDIS_URL"))
    
    # Register blueprints
    from app.routes import shorten, redirect, stats
    app.register_blueprint(shorten.bp)
    app.register_blueprint(redirect.bp)
    app.register_blueprint(stats.bp)
    
    return app
