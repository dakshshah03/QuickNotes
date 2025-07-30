from fastapi import HTTPException, UploadFile, File
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import shutil
import os
from chat import DocumentCreate
from pydantic import SecretStr, UUID4

router = APIRouter(prefix="/pdf", tags=["Chat PDF"])
UPLOAD_DIRECTORY = "./../../../pdfs/"
# TODO: When new pdf uploaded, chunk pdf and add to vector store


@router.post("/upload")
async def upload_pdf(
        file: UploadFile = File(...), 
        jwt: SecretStr = None,
        parent_notebook: UUID4 = None, 
    ):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Expected 'application/pdf', but received '{file.content_type}'."
        )
    
    # TODO: verify JWT
    # TODO: chunk pdf
    # TODO: store chunks in document_embeddings vectorDB
    
    filename = os.path.basename(file.filename)
    file_location = os.path.join(UPLOAD_DIRECTORY, filename)
        
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
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

# TODO: make endpoint to return list of pdf names
# TODO: make endpoint to enable/disable pdf for queries
# TODO: make endpoint to return a pdf
    