from uuid import UUID
from psycopg import Connection
from fastapi.responses import JSONResponse
from fastapi import UploadFile, HTTPException

from llama_index.core import Document
from llama_index.core.schema import BaseNode
from typing import List, Dict

import shutil
import os

from database.notebook.documents import create_document, document
from database.vector_store.documents import documentMetadata
from components.rag.pdf_parser import encode_pdf, parse_document, chunk_document

from database.vectordb import vector_db_instance

def save_pdf(conn: Connection, file: UploadFile, notebook_id: UUID, save_dir: str):
    try:
        filename = os.path.basename(file.filename)
        
        doc = document(
            parent_notebook=notebook_id,
            name=filename,
        )
        new_document = create_document(conn, doc)
        
        doc_name = str(new_document.id) + ".pdf"
        os.makedirs(os.path.join(save_dir, str(notebook_id)), exist_ok=True)
        file_location = os.path.join(save_dir, str(notebook_id), doc_name)
        
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        parsed_pages = parse_document(file_location)
        parsed_text = "\n".join([page.markdown for page in parsed_pages])
        doc_metadata = documentMetadata(
            parent_notebook=new_document.parent_notebook,
            document_id=new_document.id
        ) 
        
        print(doc_metadata)
        chunked_document: List[BaseNode] = chunk_document(parsed_text=parsed_text, metadata=doc_metadata)
        vector_db_instance.store_document(chunked_pdf=chunked_document)
        
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=f"Could not save file: {e}"
        )
    finally:
        file.file.close()
        
    return new_document