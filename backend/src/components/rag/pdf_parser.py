from mistralai import Mistral
from dotenv.main import load_dotenv
import os
import base64
from typing import List, Dict
from llama_index.core.node_parser import MarkdownNodeParser
from llama_index.core import Document
from llama_index.core.schema import BaseNode

from database.vector_store.documents import documentMetadata

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
    

def parse_document(pdf_path: str = None) -> List[Dict]:
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
    return ocr_response.pages # list of jsons with index, markdown, images, and dimensions

def chunk_document(
        parsed_text: str,
        metadata: documentMetadata
    ) -> List[BaseNode]:
    
    node_parser = MarkdownNodeParser.from_defaults()
    
    chunks: List[BaseNode] = []
    
    if not parsed_text.strip():
        return chunks
    
    doc = Document(
        text=parsed_text,
        metadata={}
    )
    
    nodes = node_parser.get_nodes_from_documents([doc])
    for chunk_index, node in enumerate(nodes):
        chunk_metadata = metadata.model_copy()
        chunk_metadata.chunk_index = str(chunk_index)
        
        node.metadata = chunk_metadata.model_dump()
        chunks.append(node)
        
    return chunks