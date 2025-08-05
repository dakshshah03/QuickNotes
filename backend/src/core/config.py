from argon2 import PasswordHasher
from dotenv.main import load_dotenv
import os

load_dotenv()

class Settings:
    # db config
    db_user: str = os.getenv("POSTGRES_USER")
    db_pw: str = os.getenv("POSTGRES_PW")
    db_host: str = os.getenv("POSTGRES_HOST")
    db_port: str = os.getenv("POSTGRES_PORT")
    db_name: str = os.getenv("POSTGRES_DB_NAME")
    
    pdf_storage_dir: str = os.getenv("PDF_STORAGE_DIR")
    
    # API Keys
    openai_api_key = os.getenv("OPENAI_API_KEY")
    llama_parse_api_key = os.getenv("LLAMA_CLOUD_API_KEY")
    
    # JWT
    jwt_secret_key = os.getenv("JWT_SECRET_KEY")
    jwt_algorithm = os.getenv("JWT_ALGORITHM")

    # password hasher
    password_hasher = PasswordHasher(
        time_cost=3,
        memory_cost=32768,
        parallelism=2,
        hash_len=32,
        salt_len=16,
        encoding='utf-8'
    )
    
    