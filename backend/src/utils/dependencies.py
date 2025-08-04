from fastapi import HTTPException, Depends
from typing import Generator, Annotated
from database.db import db_instance
import psycopg

def get_db_connection() -> Generator[psycopg.Connection, None, None]:
    """Dependency that provides a database connection and ensures it's returned to the pool"""
    conn = None
    try:
        conn = db_instance.get_connection()
        yield conn
    finally:
        if conn:
            db_instance.return_connection(conn)

# Type alias for dependency injection
DBCxn = Annotated[psycopg.Connection, Depends(get_db_connection)]