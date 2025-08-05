from fastapi import HTTPException, Depends
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
import psycopg
from jwt import PyJWTError

from utils.dependencies import DBCxn
from core.config import Settings
from schema.authentication import JWTPayload
from backend.src.database.notebook import notebook
from components.authentication.access_token import verifyJWT

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/dashboard", tags=["authentication login"])

@router.get("/notebooks")
async def get_notebooks(
        conn: DBCxn,
        token: str = Depends(oauth2_scheme)
    ):
    try:
        payload = verifyJWT(token)
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token: user_id not found"
            )
        
        notebook_list = notebook.fetch_notebook_list(conn, user_id)
        return notebook_list
        
    except HTTPException:
        raise
    except PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )


