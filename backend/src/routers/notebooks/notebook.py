from fastapi import HTTPException, Depends, Form
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from uuid import UUID
from jwt import PyJWTError

from utils.dependencies import DBCxn
from core.config import Settings
from schema.authentication import JWTPayload
from components.authentication.access_token import verifyJWT

from database.notebook.notebook import fetch_owner, insert_notebook, notebook
from database.notebook.documents import get_document_list
from database.chats.chat import get_chat_list

# TODO: handle clicking notebook (loads notebook)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/notebook", tags=["notebook"])

@router.post("/create")
async def create_notebook(
        conn: DBCxn,
        token: str = Depends(oauth2_scheme),
        notebook_name: str = Form(...)
    ):
    new_notebook: notebook = None
    try:
        payload = verifyJWT(token)
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token payload"
            )
        
        nb = notebook(
            notebook_owner=user_id,
            notebook_name=notebook_name,
            storage_dir=Settings.pdf_storage_dir
        )
        new_notebook = insert_notebook(conn, nb)
    except HTTPException:
        raise
    except PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {e}"
        )
    return JSONResponse(
            status_code=201,
            content=new_notebook.model_dump_json()
        )
    
@router.get("/load/{notebookId}")
async def load_notebook(
        conn: DBCxn,
        notebookId: UUID,
        token: str = Depends(oauth2_scheme)
    ):
    payload = verifyJWT(token)
    user_id = payload.get("user_id")
    notebook_owner = fetch_owner(conn, notebookId)
    
    if user_id != notebook_owner:
        raise HTTPException(
            status_code=403,
            detail=f"User {user_id} does not have access to resource."
        )
    
    # call function loading documents
    docs = get_document_list(conn, notebookId)
    # call function loading chats in notebook
    chats = get_chat_list(conn, notebookId)
    
    return {
        "documents": docs,
        "chats": chats
    }

# rename notebook, edit description
@router.patch("/edit")
async def edit_notebook():
    pass

@router.delete("/delete")
async def delete_notebook():
    pass