from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User
from passlib.context import CryptContext
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

pwd_context = CryptContext(schemes=['pbkdf2_sha256'], deprecated='auto')

# Check if user exists
existing = db.query(User).filter(User.email == "admin@biasguard.ai").first()
if existing:
    print("✅ Admin user already exists")
else:
    new_user = User(
        username="admin",
        email="admin@biasguard.ai",
        hashed_password=pwd_context.hash("admin123"),
        role="admin",
        is_active=True,
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    print("✅ Admin user created successfully!")

print("Email: admin@biasguard.ai")
print("Password: admin123")

db.close()
