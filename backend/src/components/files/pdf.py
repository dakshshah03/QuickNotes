from uuid import UUID
from psycopg import Connection
from fastapi.responses import JSONResponse
from fastapi import UploadFile, HTTPException

import shutil
import os

from database.notebook.documents import create_document, document

def save_pdf(conn: Connection, file: UploadFile, notebook_id: UUID, save_dir: str):
    filename = os.path.basename(file.filename)
    # Ensure the directory exists
    os.makedirs(save_dir, exist_ok=True)
    file_location = os.path.join(save_dir, filename)
    new_document: document = None
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # cursor = conn.cursor()
        doc = document(
            parent_notebook=notebook_id,
            name=filename,  # Use the actual filename
        )
        new_document = create_document(conn, doc)
    
        # TODO: chunk pdf
        # TODO: store chunks in document_embeddings vectorDB
        
        # return JSONResponse(
        #     status_code=200,
        #     content={
        #         "message": "PDF uploaded successfully!",
        #         "filename": filename,
        #         "path": os.path.abspath(file_location)
        #     }
        # )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not save file: {e}"
        )
    finally:
        file.file.close()
        
    return new_document