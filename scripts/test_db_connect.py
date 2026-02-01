# scripts/test_db_connect.py
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

print("Testing connection to:", DATABASE_URL)

# psycopg2 accepts a URI directly
try:
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cur = conn.cursor()
    cur.execute("SELECT 1;")
    print("OK - SELECT 1 returned:", cur.fetchone())
    cur.close()
    conn.close()
except Exception as e:
    print("Connection failed:", e)
