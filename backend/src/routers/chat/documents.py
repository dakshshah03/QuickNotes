from fastapi import HTTPException, UploadFile, File, Form
from fastapi import APIRouter, Request, Depends
from fastapi.security import OAuth2PasswordBearer
from utils.dependencies import DBCxn
from typing import Optional

from uuid import UUID
from components.authentication.access_token import verifyJWT
from database.notebooks import fetch_owner
from components.files.pdf import save_pdf

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/pdf", tags=["Chat PDF"])
UPLOAD_DIRECTORY = "./pdfs/"
# TODO: When new pdf uploaded, chunk pdf and add to vector store


@router.post("/upload")
async def upload_pdf(
        conn: DBCxn, 
        token: str = Depends(oauth2_scheme),
        file: UploadFile = File(...,),
        parent_notebook: Optional[UUID] = Form(None)
    ):
    payload = verifyJWT(token)
    user_id = UUID(payload.get("user_id"))
    notebook_owner = fetch_owner(conn, parent_notebook)
    
    if user_id != notebook_owner:
        raise HTTPException(
            status_code=403,
            detail=f"User {user_id} does not have access to resource."
        )
    
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Expected 'application/pdf', but received '{file.content_type}'."
        )
    
    # TODO: chunk pdf
    # TODO: store chunks in document_embeddings vectorDB
    
    return save_pdf(file, save_dir=UPLOAD_DIRECTORY)
    
    

# TODO: make endpoint to return list of pdf names
# TODO: make endpoint to enable/disable pdf for queries
# TODO: make endpoint to return a pdf
