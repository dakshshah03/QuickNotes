from openai import OpenAI
from typing import List, Dict
from core.external_connections import LLM

def construct_prompt(context: List[str],user_prompt: str):
    input_prompt = {
        "id": LLM.openai_prompt,
        "version": "4",
        "variables": {
            "context": "\n".join(context),
            "user_prompt": user_prompt
        } 
    }
    
    return input_prompt

def query_llm(system_prompt: Dict):
    client = LLM.openai_client
    
    response = client.responses.create(
        model="gpt-5",
        prompt=system_prompt
    )
    
    return response.output_text