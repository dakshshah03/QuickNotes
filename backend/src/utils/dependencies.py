
from fastapi import HTTPException, Depends
from typing import Annotated
from database.db import db_instance
import psycopg

async def get_db_connection():
    try:
        with db_instance.get_connection() as conn:
            yield conn
    except Exception as e:
        print(f"Error getting database connection: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")
    
DBCxn = Annotated[psycopg.Connection, Depends(get_db_connection)]