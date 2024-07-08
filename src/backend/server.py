import os
import threading
import logging
import psycopg2
from datetime import datetime
from pydantic import BaseModel
from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import random, string, time


app = FastAPI()

# def versus async def
# def for requests and sqlite3
# async def for httpx and aiohttp

# Data class going into database
class PasswordEntry(BaseModel):
    time: datetime
    name: str
    password: str


# Caching the password with key value store
class KeyValueStore:
    def __init__(self):
        self.store = {}
        self.lock = threading.Lock()

    def set(self, key, values):
        with self.lock:
            logging.info(f"Setting value for {key}: {values}")
            self.store[key] = list(values)

    def fetch(self, key):
        with self.lock:
            logging.info(f"~~~~~~~~~~~~~~~~~~~~~~~~Fetching value for {key}")
            value = self.store.get(key)
            logging.info(f"~~~~~~~~~~~~~~~~~~~~~~~~Value: {value}")
            return value
    def keys(self):
        with self.lock:
            logging.info(f"Fetching keys")
            logging.info(f"Keys: {list(self.store.keys())}")
            return list(self.store.keys())

# Setting up CORS middleware for information being able to be
# accessed from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Setting up logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("Started the server")
# Setting up the connection to the database
CONNECTION = "postgresql://postgres:password@127.0.0.1:5432/postgres"
TESTING = True
# New database connection
cur = False # Initial cursor
def connect_to_db():
    try:
        db = psycopg2.connect(CONNECTION)
        logger.info("Connected to the database")
        return db
    except psycopg2.Error as e:
        logger.info("Unable to connect to the database")
        logger.info(e.pgerror)
        logger.info(e.diag.message_detail)
        return None
logger.info("Connecting to the database")
db = connect_to_db() # Database connection
cur = db.cursor()

 # Check if the 'passwords' table exists, and create it if it doesn't
logger.info("Attempt to create table")
cur.execute("""
    SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE  schemaname = 'public'
        AND    tablename  = 'passwords'
            );
        """)
if not cur.fetchone()[0]:
    cur.execute("""
        CREATE TABLE passwords (
            id SERIAL PRIMARY KEY,
            time TIMESTAMP NOT NULL,
            name VARCHAR(255) NOT NULL,
            password TEXT NOT NULL
        );
    """)
    db.commit()
    logger.info("Created table 'passwords'")
else:
    logger.info("Table exists")
if cur == False:
    logger.error("Cursor is not defined. Is the database connected?")
    exit(-1)

# Checks if data exists in the database
# Bool return for existance 
def check_data(name):
    try:
        check_query = "SELECT * FROM passwords WHERE name = %s"
        cur.execute(check_query, (name,))
        result = cur.fetchone()
        if result is None:
            logger.info("Does not exist")
            return False
        else:
            logger.info("Does Exist")
            return True
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

# Insert Data
def insert_data(time, name, password):
    combined_time = f"{time[0]} {time[1]}"  
    datetime_object = datetime.strptime(combined_time, "%Y-%m-%d %H:%M:%S.%f")
    if not check_data(name):
        try:
            query = "INSERT INTO passwords (time, name, password) VALUES (%s, %s, %s)"
            cur.execute(query, (datetime_object, name, password))
            logger.info("Inserted")
            db.commit()
        except Exception as e:
            print(f"An error occurred: {e}")
            db.rollback()
    else:
        logger.info("Already Exists")

# Generate Time
def gen_time():
    print("Generating time:")
    current_time = datetime.now().time()
    current_date = datetime.now().date()
    return current_date,current_time

# Generate Password
def gen_pass(password_length, char_inc):
    symbolset = "!;#$%&'()*+,-./:;<=>?@[]^_`{|}~"
    charset = string.ascii_letters + string.digits
    if char_inc:
        charset += symbolset
    print("Generating password...!")
    print("Something here")
    print("Password length: ", password_length)
    password = ''.join(random.choice(charset) for _ in range(password_length))
    print(f"Password: {password}")
    return password

# REST API for generating password
@app.get("/api/v1/health")
async def health():
    return {"message": "Hello from the server!"}

@app.get("/api/v1/button-clicked")
async def button_clicked():
    return {"message": "Button clicked!"}

@app.get("/api/v1/password/generate/{password_length}/{char_inc}/{nameValue}")
async def generate_password(password_length: int, char_inc: bool, nameValue: str):
    password = gen_pass(password_length, char_inc)
    time = gen_time()
    insert_data(time,nameValue,password)
    
    return {"time": time, "name": nameValue, "password": password}

