import psycopg
from pydantic import EmailStr


def create_user(
        conn: psycopg.Connection,
        email: EmailStr,
        name: str,
        password_hash: str
    ):
    cursor = None
    user_id = None
    
    try: 
        cursor = conn.cursor()
        
        store_user_query = """
        INSERT INTO users (email, name, password_hash)
        VALUES (%s, %s, %s)
        RETURNING user_id;
        """
        
        cursor.execute(store_user_query, (email, name, password_hash))
        result = cursor.fetchone()
        user_id = result[0] if result else None
    
    except psycopg.Error as e:
        print(f"Database error creating account for user with email {email}: {e}")
        raise 
    finally:
        if cursor:
            cursor.close()
    
    return user_id