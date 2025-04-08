# backend/swagger_server/db/database.py
import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME")
}

# Create connection pool
connection_pool = pooling.MySQLConnectionPool(
    pool_name="air_quality_pool",
    pool_size=5,
    **db_config
)

def get_connection():
    """Get a connection from the pool"""
    return connection_pool.get_connection()

def execute_query(query, params=None, fetch=True):
    """Execute a query and return results if needed"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute(query, params or ())
        
        if fetch:
            result = cursor.fetchall()
            return result
        else:
            connection.commit()
            return cursor.lastrowid
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        cursor.close()
        connection.close()