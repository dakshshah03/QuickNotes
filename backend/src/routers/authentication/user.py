from fastapi import HTTPException
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/auth", tags=["authentication user"])
# create, update, delete user 

@router.post("/create-user")
async def create_user():
    pass

# @router.post("/update-user")

# @router.post("delete-user")