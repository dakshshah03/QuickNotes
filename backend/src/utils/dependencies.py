from fastapi import HTTPException, Depends
from typing import Annotated
from database.db import db_instance
import psycopg

async def get_db_connection():
    try:
        with db_instance.get_connection() as conn:
            yield conn
    except HTTPException:
        # Re-raise HTTPExceptions (like 401 auth errors) as-is
        raise
    except psycopg.Error as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")
    except Exception as e:
        print(f"Unexpected error getting database connection: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")
    
DBCxn = Annotated[psycopg.Connection, Depends(get_db_connection)]