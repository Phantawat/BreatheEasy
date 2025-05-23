import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

# Database configuration
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME")
}

# Lazy-initialized connection pool
_connection_pool = None

def _init_pool():
    """Initialize the connection pool on first use."""
    global _connection_pool
    if _connection_pool is None:
        _connection_pool = pooling.MySQLConnectionPool(
            pool_name="air_quality_pool",
            pool_size=1,
            **db_config
        )
    return _connection_pool

def get_connection():
    """Get a connection from the initialized pool."""
    pool = _init_pool()
    return pool.get_connection()

def execute_query(query, params=None, fetch=True):
    """Execute a query and return results if needed"""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query, params or ())
        if fetch:
            return cursor.fetchall()
        else:
            connection.commit()
            return cursor.lastrowid
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        cursor.close()
        connection.close()




# Custom timed cache
_cache = {}
def timed_cache(ttl=10):
    def decorator(func):
        def wrapper(*args):
            key = (func.__name__, args)
            now = time.time()
            # If cache exists and is fresh
            if key in _cache:
                result, timestamp = _cache[key]
                if now - timestamp < ttl:
                    return result
            # Otherwise fetch and cache
            result = func(*args)
            _cache[key] = (result, now)
            return result
        return wrapper
    return decorator

