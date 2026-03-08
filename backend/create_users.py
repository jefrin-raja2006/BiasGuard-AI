from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User
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

# List of users to create
users_to_create = [
    {
        "username": "admin",
        "email": "admin@biasguard.ai",
        "password": "punas",
        "role": "admin"
    },
    {
        "username": "doctor",
        "email": "doctor@hospital.com",
        "password": "punas",
        "role": "doctor"
    },
    {
        "username": "researcher",
        "email": "researcher@lab.com",
        "password": "punas",
        "role": "researcher"
    },
    {
        "username": "demo",
        "email": "demo@biasguard.ai",
        "password": "punas",
        "role": "user"
    }
]

print("Creating users with encrypted passwords...\n")

for user_data in users_to_create:
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_data["email"]).first()
    
    if existing:
        print(f"⚠️  User {user_data['email']} already exists (skipping)")
    else:
        new_user = User(
            username=user_data["username"],
            email=user_data["email"],
            hashed_password=pwd_context.hash(user_data["password"]),
            role=user_data["role"],
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(new_user)
        db.commit()
        print(f"✅ Created user: {user_data['email']} (password: {user_data['password']})")

print("\n" + "="*60)
print("✅ All users created with encrypted passwords!")
print("="*60)
print("\nLogin Credentials:")
print("="*60)
for user_data in users_to_create:
    print(f"Email: {user_data['email']}")
    print(f"Password: {user_data['password']}")
    print(f"Role: {user_data['role']}")
    print("-"*60)

db.close()
