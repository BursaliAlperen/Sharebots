from flask import Flask, request, jsonify, g
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATABASE = "users.db"

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    db.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        referrer TEXT
    )
    """)
    db.commit()

@app.route("/kayit", methods=["POST"])
def kayit():
    data = request.get_json()
    if not data or "id" not in data or "username" not in data:
        return jsonify({"message": "Eksik veri gönderildi!"}), 400

    user_id = data.get("id")
    username = data.get("username")
    referrer = data.get("referrer")

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    if cursor.fetchone():
        return jsonify({"message": "Zaten kayıtlı!"})

    cursor.execute("INSERT INTO users (id, username, referrer) VALUES (?, ?, ?)",
                   (user_id, username, referrer))
    db.commit()

    return jsonify({"message": f"{username} kaydedildi!"})

if __name__ == "__main__":
    with app.app_context():
        init_db()
    app.run(host="0.0.0.0", port=5000)
