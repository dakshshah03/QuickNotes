from mistralai import Mistral
from dotenv import load_dotenv
import os
import base64

load_dotenv()

def encode_pdf(pdf_path: str) -> base64:
    """
    Encodes pdf as base64 for OCR
    """
    try:
        with open(pdf_path, "rb") as pdf_file:
            return base64.b64encode(pdf_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: The file {pdf_path} was not found.")
        return None
    except Exception as e:  # Added general exception handling
        print(f"Error: {e}")
        return None
    

def parse_document(pdf_path: str = None):
    api_key = os.environ["MISTRAL_API_KEY"]
    client = Mistral(api_key=api_key)
    
    base64_pdf = encode_pdf(pdf_path=pdf_path)
    
    ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
        document={
            "type": "document_url",
            "document_url": f"data:application/pdf;base64,{base64_pdf}" 
        },
        include_image_base64=True
    )
    
