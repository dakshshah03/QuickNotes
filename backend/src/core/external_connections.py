from openai import OpenAI
import os
from dotenv.main import load_dotenv

load_dotenv()

class LLM:
    openai_client = OpenAI()
    openai_prompt = os.getenv("OPENAI_PROMPT_ID")