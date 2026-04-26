# 🔗 URL Shortener

A simple, scalable URL Shortening API built with **Flask**, **PostgreSQL (Supabase)**, and **Redis**.  
It allows users to shorten long URLs, redirect using short codes, and retrieve basic usage statistics.
---

## 📌 Features

- Generate short URLs with **5‑character Base62 codes**
- Redirect to original URLs
- Track click counts
- Prevent click double‑counting (Redis-based)
- PostgreSQL persistence (Supabase)
- RESTful API design
- Ready for React frontend consumption
---

## 🧱 Tech Stack

- **Backend**: Flask
- **Database**: PostgreSQL on Supabase
- **Cache**: Redis
- **ORM**: SQLAlchemy
- **Migrations**: Flask‑Migrate

---

## 📂 Project Structure
```
url_shortener/
├── app/
│ ├── init.py
│ ├── config.py
│ ├── models.py
│ ├── routes/
│ ├── services/
│ └── utils/
├── migrations/
├── scripts/
├── tests/
├── manage.py
├── .env
└── README.md
```
---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd url_shortener
```

### 2. Create and activate virtual environment

```python -m venv venv source venv/bin/activate # on Linux / macOS``` 
```venv\Scripts\activate # on Windows```


### 3. Install dependencies
```pip install -r requirements.txt```

### 4. Environment Variables
Create a ```.env``` file at the root of the project with the content below:
```
FLASK_ENV=development
FLASK_APP=manage.py
SECRET_KEY=your_secret_key
DATABASE_URL=postgresql+psycopg2://postgres:<PASSWORD>@db.<project-ref>.supabase.co:5432/postgres
REDIS_URL=redis://localhost:6379/0
```

### 5. Database Migrations
```flask db init # run once```
```flask db migrate -m "initial migration"```
```flask db upgrade```

### 6. Run the application
```python manage.py```
The API will be available at: 
```http://127.0.0.1:5000```


## API Documentation
**Base URL**
```http://127.0.0.1:5000```

### 1. Create a Short URL
Endpoint
```POST /api/shorten```

Request Body
```{ "url": "https://example.com" }```
Success Response (201)
```{ "short_code": "A9kLm", "short_url": "http://127.0.0.1:5000/A9kLm" }```
Error Response (400)
```{ "error": "URL is required" }```

### 2. Redirect to Original URL
Endpoint
```GET /{short_code}```
Example
```GET /A9kLm```

***Behavior**
- Redirects to the original URL
- Increments click count
- Error
- 404 if short code does not exist

### 3. Get URL Statistics
Endpoint
```GET /api/stats/{short_code}```

**Response (200)**
```{ "original_url": "https://example.com", "short_code": "A9kLm", "click_count": 12, "created_at": "2026-02-15T12:00:00Z" }```
**Error (404)**
```{ "error": "URL not found" }```

### 4. Health Check (Optional)
**Endpoint**
```GET /api/health```
**Response**
{ "status": "ok" }

#### Short Code Generation
- Exactly 5 characters
- Base62 character set: 0–9, A–Z, a–z
- Generated using cryptographically secure randomness
- Collision-safe via database uniqueness constraint

 #### Click De‑duplication Logic
**To prevent artificial inflation of click counts:**
- Clicks are fingerprinted using:
    - IP address
    - User‑Agent
    - Short code
- Redis stores fingerprints temporarily
- Repeated clicks within the TTL window are ignored

#### Frontend Integration
The API is designed to be easily consumed by a React frontend.
Example request:
```axios.post("/api/shorten", { url: "https://example.com" });```

**🧪 Testing**
```pytest```

**🚀 Future Improvements**
- User authentication
- Custom short codes
- Expiring URLs
- Rate limiting
- Advanced analytics dashboard

👨‍💻 Contributors:
- Elvira @elvira-create
- Ryle Djieuga @DJIEUGA


