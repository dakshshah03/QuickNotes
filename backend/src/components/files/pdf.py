from uuid import UUID
from psycopg import Connection
from fastapi.responses import JSONResponse
from fastapi import UploadFile, HTTPException

import shutil
import os

from database.notebook.documents import create_document, document

def save_pdf(conn: Connection, file: UploadFile, notebook_id: UUID,  save_dir: str):
    filename = os.path.basename(file.filename)
    file_location = os.path.join(save_dir, filename)
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        doc = document(
            parent_notebook=notebook_id
        )
        
        create_document(conn, doc)
    
        # TODO: chunk pdf
        # TODO: store chunks in document_embeddings vectorDB
        
        return JSONResponse(
            status_code=200,
            content={
                "message": "PDF uploaded successfully!",
                "filename": filename,
                "path": os.path.abspath(file_location)
            }
        )
    except Exception as e:
        # Handle potential errors during file saving
        raise HTTPException(
            status_code=500,
            detail=f"Could not save file: {e}"
        )
    finally:
        # Ensure the uploaded file's temporary buffer is closed
        file.file.close()