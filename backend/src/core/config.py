from dotenv import load_dotenv
import os

load_dotenv()

class settings:
    # db config
    db_user: str = os.getenv("POSTGRES_USER")
    db_pw: str = os.getenv("POSTGRES_PW")
    db_host: str = os.getenv("POSTGRES_HOST")
    db_port: str = os.getenv("POSTGRES_PORT")
    db_name: str = os.getenv("POSTGRES_DB_NAME")
    
    # API Keys
    openai_api_key = os.getenv("OPENAI_API_KEY")
    llama_parse_api_key = os.getenv("LLAMA_CLOUD_API_KEY")

    # 
    
    