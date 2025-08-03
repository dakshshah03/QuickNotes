import psycopg
from pydantic import EmailStr
from utils.exceptions import UserNotFoundError

def fetch_pw_hash(conn: psycopg.Connection, email: EmailStr):
    """
    Fetches password hash

    Args:
        conn (psycopg.Connection): connection to database to make the query
        email (EmailStr): email to query hash from
    """
    cursor = None
    password_hash = None
    user_id = None
    
    try:
        cursor = conn.cursor()
        
        # First, let's check if the table exists and has data
        cursor.execute("SELECT COUNT(*) FROM users;")
        user_count = cursor.fetchone()[0]
        print(f"Total users in database: {user_count}")
        
        # Now fetch the specific user
        pw_hash_query = """
        SELECT user_id, password_hash
        FROM users
        WHERE email = %s;
        """
        
        cursor.execute(pw_hash_query, (email,))
        row = cursor.fetchone()
        
        if row:
            user_id, password_hash = row[0], row[1]
            print(f"Successfully retrieved password hash for {email}.")
        else:
            raise UserNotFoundError(f"No user found with email {email}.")
            
    except psycopg.Error as e:
        print(f"Database error retrieving password hash for email {email}: {e}")
    finally:
        if cursor:
            cursor.close()
    
    return user_id, password_hash
