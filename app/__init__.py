import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["APP_DOMAIN"] = os.getenv("APP_DOMAIN", "http://localhost:5000")

    CORS(app, origins=os.getenv("CORS_ORIGINS", "http://localhost:3000"))

    db.init_app(app)
    migrate.init_app(app, db)

    from app.routes import urls, redirect
    app.register_blueprint(urls.bp)
    app.register_blueprint(redirect.bp)

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app
