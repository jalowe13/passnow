import os
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import random, string, time


app = FastAPI()

# def versus async def
# def for requests and sqlite3
# async def for httpx and aiohttp


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
    print("Password length: ", password_length)
    random.seed(time.time())
    password = ''.join(random.choice(charset) for _ in range(password_length))
    return password

@app.get("/")
async def root():
    return {"message": "Hello World!"}

@app.get("/api/{endpoint}")
async def button_clicked_handler(passwordLength: Optional[int] = None, charToggle: Optional[bool] = None):
    print("Button was clicked right now!")
    password = gen_pass(passwordLength, charToggle) # Generate password
    print("Generated password: ", password)
    return Response(content=password, media_type="text/plain")

@app.get("/api/set")
async def set_handler():
    return {"message": "Set endpoint"}


