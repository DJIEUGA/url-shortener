
import os
from app import create_app, db
from flask_migrate import Migrate

app = create_app()
migrate = Migrate(app, db)

if __name__ == "__main__":
    if os.getenv('FLASK_ENV') != 'production':
        app.run(debug=True)
    else:
        port = int(os.environ.get("PORT", 5000))
        app.run(host="0.0.0.0", port=port)
