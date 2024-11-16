import os
import threading
import logging
import csv
import psycopg2
import pandas as pd
from datetime import datetime, time, date
from pydantic import BaseModel
from fastapi import FastAPI, Response, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import random, string
import time as time_module
from psycopg2.extensions import connection, cursor  # For PostgreSQL

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
def connect_to_db() -> connection:
    try:
        db = psycopg2.connect(CONNECTION)
        logger.info("Connected to the database")
        return db
    except psycopg2.Error as e:
        logger.error("Unable to connect to the database")
        logger.error(e.pgerror)
        if hasattr(e.diag, 'message_detail'):
            logger.error(e.diag.message_detail)
        raise ConnectionRefusedError("Failed to connect to the database") from e
logger.info("Connecting to the database")
db: connection = connect_to_db() # Database connection
cur: cursor = db.cursor() # Cursor

 # Check if the 'passwords' table exists, and create it if it doesn't
logger.info("Attempt to create table")
cur.execute("""
    SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE  schemaname = 'public'
        AND    tablename  = 'passwords'
            );
        """)
result = cur.fetchone()
if result is None:
    raise ValueError("Expected a result got none")
if not result[0]:
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
def check_data(name:str):
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
# Returns all data from passwords
def all_data():
    try:
        check_query = "SELECT * FROM passwords"
        cur.execute(check_query)
        result = cur.fetchall()
        if not result: # Handles empty result
            logger.info("No data")
            return {"message": f"No data", "status": "success"}
        else:
            logger.info("Data Exists")
            for e in result:
                logger.info(e)
                csv_file = "output.csv"
                with open(csv_file, 'w', newline='') as file:
                    writer = csv.writer(file)
                    writer.writerow(["Name", "Code"])
                    for row in result:
                        id, timestamp, name, code = row
                        writer.writerow([name, code])
            return result
    except Exception as e:
            print(f"An error occurred: {e}")

def entries_length():
    try:
        count_query = "SELECT COUNT(*) FROM passwords"
        cur.execute(count_query)
        count_result = cur.fetchone()
        entry_count = count_result[0] 
        return entry_count
    except Exception as e:
        print(f"An error occured: {e}")
# Slice Data
def slice_data(start:int , end:int ):
    if start < 0 or end < start:
        return ValueError("Invalid start or end indexes")
    try:
        check_query = """
        SELECT * FROM passwords
        LIMIT %s OFFSET %s
        """
        cur.execute(check_query, (end-start, start))
        result = cur.fetchall()
        if not result: # Handles empty result
            logger.info("No data")
            return {"message": f"No data", "status": "success"}
        else:
            logger.info("Data Exists")
            for e in result:
                logger.info(e)
            return result
    except Exception as e:
            print(f"An error occurred: {e}")

# Slice Data Keyword
def slice_data_keyword(keyword:str):
    logger.info("Search for Keyword:" + keyword)
    if len(keyword) == 0:
        return ValueError("String is empty")
    try:
        check_query = """
        SELECT * FROM passwords
        where name LIKE %s
        """
        search_pattern = f"%{keyword}%"
        cur.execute(check_query, (search_pattern,))
        result = cur.fetchall()
        if not result: # Handles empty result
            logger.info("No data")
            return {"message": f"No data", "status": "success"}
        else:
            logger.info("Data Exists")
            for e in result:
                logger.info(e)
            return result
    except Exception as e:
            print(f"An error occurred: {e}")
    return 0;


# Insert Data
def insert_data(time:tuple[time,date], name:str, password:str):
    combined_time = f"{time[1]} {time[0]}"
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

# Delete Data
def delete_data(name):
    logger.info("Delete data")
    delete_query = "DELETE FROM passwords WHERE name = %s RETURNING *;"
    cur.execute(delete_query, (name,))
    deleted_rows = cur.fetchall()
    db.commit()
    if deleted_rows:
        return {"message": f"Deleted {name}", "status": "success"}
    else:
        return {"message": f"No record found for {name}", "status": "failed"}
# Generate Time
def gen_time()-> tuple[time,date]:
    print("Generating time:")
    current_time: time = datetime.now().time()
    current_date: date = datetime.now().date()
    comb: tuple[time,date] = (current_time,current_date)
    return comb


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

# Import passwords
def import_passwords(request):
    for e in request:
        logger.info(e)
        nameValue = e['name'].upper() # Normalize
        password = e['password']
        curr_time: tuple[time,date] = gen_time()
        logger.info(f"[{time}] Inserting {nameValue} with {password}")
        insert_data(curr_time, nameValue, password)

# Models
class PasswordSliceKeyword(BaseModel):
    keyword: str
class PasswordGenerateRequest(BaseModel):
    password_length: int
    char_inc: bool
    nameValue: str
class DeletePasswordRequest(BaseModel):
    nameValue: str

class PasswordSliceRequest(BaseModel):
    start_idx: int
    end_idx: int

API_V = "/api/v1/"

# REST API for generating password
@app.get(f"{API_V}health")
async def health():
    return {"message": "Hello from the server!"}

@app.get(f"{API_V}button-clicked")
async def button_clicked():
    return {"message": "Button clicked!"}

# TODO: Import passwords for generation after doing Add password on the client
@app.post(f"{API_V}password/import")
async def import_password(request = Body(...)):
    import_passwords(request)
    return {"message": "Imported into database"}
@app.post(f"{API_V}password/generate")
async def generate_password(request: PasswordGenerateRequest = Body(...)):
    nameValue = request.nameValue.upper() # Normalize
    password = gen_pass(request.password_length, request.char_inc)
    time = gen_time()
    insert_data(time, nameValue, password)
    return {"time": time, "name": nameValue, "password": password}

@app.get(f"{API_V}password/all")
async def all_passwords():
    return all_data()

@app.get(f"{API_V}password/all")
async def all_passwords():
    return all_data()

@app.get(f"{API_V}password/amount")
async def entries_length_get():
    length = entries_length()
    print("Length", length)
    return entries_length() 

@app.post(f"{API_V}password/")
async def slice_passwords(request: PasswordSliceRequest = Body(...)):
    start = request.start_idx
    end = request.end_idx
    return slice_data(start,end)

@app.delete(f"{API_V}password/")
async def delete_password(request: DeletePasswordRequest):
    return delete_data(request.nameValue.upper())

@app.post(f"{API_V}password/keyword")
async def fetch_keyword_password(request: PasswordSliceKeyword):
    keyword = request.keyword
    return slice_data_keyword(keyword);
