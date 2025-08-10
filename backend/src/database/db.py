from core.config import Settings
import psycopg
from psycopg_pool import ConnectionPool

class Database:
    def __init__(
        self,
        DB_HOST: str = Settings.db_host,
        DB_USERNAME: str = Settings.db_user,
        DB_PASSWORD: str = Settings.db_pw,
        DB_NAME: str = Settings.db_name,
        DB_PORT: str = Settings.db_port
    ):
        self.host= DB_HOST
        self.username = DB_USERNAME
        self.password = DB_PASSWORD
        self.dbname = DB_NAME
        self.port = DB_PORT
        
        self.pool = None
        
    def connect(self, min_conn=1, max_conn=10):
        if(self.pool is not None):
            print("Connection pool already exists")
            return

        try:
            conninfo = (
                f"dbname={self.dbname} user={self.username} "
                f"password={self.password} host={self.host} port={self.port}"
            )
            
            self.pool = ConnectionPool(
                conninfo=conninfo,
                min_size=min_conn,
                max_size=max_conn,
            )
            
            self.pool.wait()
            
            print(f"Database connection pool established to {self.dbname}.")
        except psycopg.Error as e:
            print(f"Error initializing connection pool {e}")
            self.pool = None
            
    def get_connection(self):
        if self.pool is None:
            raise RuntimeError("Connection pool not initialized")
        return self.pool.getconn()

    def return_connection(self, conn):
        """Return a connection back to the pool"""
        if self.pool and conn:
            self.pool.putconn(conn)

    def close(self):
        if self.pool:
            self.pool.close()
            print("Database connection pool closed.")
            self.pool = None

db_instance = Database()