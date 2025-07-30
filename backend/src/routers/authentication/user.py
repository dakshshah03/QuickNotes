from fastapi import HTTPException
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/authentication", tags=["authentication user"])
# create, update, delete user 

