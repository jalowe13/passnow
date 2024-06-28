import os
import threading
import logging
from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import random, string, time


app = FastAPI()

# def versus async def
# def for requests and sqlite3
# async def for httpx and aiohttp

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

# Generate Password
def gen_pass(password_length, char_inc):
    symbolset = "!;#$%&'()*+,-./:;<=>?@[]^_`{|}~"
    charset = string.ascii_letters + string.digits
    if char_inc:
        charset += symbolset
    print("Generating password...!")
    print("Something here")
    print("Password length: ", password_length)
    random.seed(time.time())
    password = ''.join(random.choice(charset) for _ in range(password_length))

    print(f"Password with time: {password}")

    return password

# REST API for generating password
@app.get("/api/v1/health")
async def health():
    return {"message": "Hello from the server!"}

@app.get("/api/v1/button-clicked")
async def button_clicked():
    return {"message": "Button clicked!"}

@app.get("/api/v1/password/generate/{password_length}/{char_inc}")
async def generate_password(password_length: int, char_inc: bool):
    password = gen_pass(password_length, char_inc)
    return {"password": password}

