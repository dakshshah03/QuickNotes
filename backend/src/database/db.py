from core import settings
import psycopg

class Database:
    def __init__(
        self,
        DB_HOST: str,
        DB_USERNAME: str,
        DB_PASSWORD: str,
        DB_NAME: str,
        DB_PORT: str
    ):
        self.host= DB_HOST
        self.username = DB_USERNAME
        self.password = DB_PASSWORD
        self.dbname = DB_NAME
        self.port = DB_PORT
        
        self.conn = None
        
    def connect(self):
        try:
            self.conn = psycopg.connect(
                dbname=self.dbname,
                user=self.username,
                password=self.password,
                host=self.host,
                port=self.port
            )
            print(f"Database connection established to {self.dbname}.")
        except psycopg.DatabaseError as e:
            print(f"Error connecting to the database: {e}")
    
    def close(self):
        if self.conn and not self.conn.closed:
            self.conn.close()
            print("Database connection closed.")