from fastapi import HTTPException, Depends, Form
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from utils.dependencies import DBCxn
from core.config import Settings
from schema.authentication import JWTPayload
from backend.src.database import notebooks
from components.authentication.access_token import verifyJWT
from jwt import PyJWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/chat", tags=["chat CRUD"])

@router.post("/create")
async def create_chat(
        conn: DBCxn,
        chat_name: str = Form(...),
        token: str = Depends(oauth2_scheme)
    ):
    new_chat = None
    try:
        payload = verifyJWT(token)
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token payload"
            )
            
        # TODO: create chat model, send info like chat name and notebook id
        # TODO: call insert_chat function in database
        
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
            content=new_chat.model_dump_json()
        )

@router.patch("/name")
async def rename_chat():
    pass

@router.delete("/delete")
async def delete_chat():
    pass