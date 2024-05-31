import os
from fastapi import FastAPI, Response, HTTPException
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

@app.get("/api/button-clicked")
async def button_clicked_handler():
    return {"message": "Button clicked!"}

@app.get("/api/copy-password")
async def copy_password_handler(passwordName: str):
    """
    Copy a password to the clipboard from the database
    based on the password name provided

    Args:
    passwordName (str): The name of the password to copy

    Returns:
    Response: The message indicating that the password is copied
    """
    if (passwordName is None):
        raise HTTPException(status_code=400, detail="Password name not provided")
    return {"message": "Copy password endpoint is called {passwordName}"} 

@app.get("/api/save")
async def save_handler():
    return {"message": "Save endpoint"}

@app.get("/api/generate-password")
async def button_clicked_handler(passwordLength: Optional[int] = None, charToggle: Optional[bool] = None):
    """
    Generate a password based on the length and character toggle provided

    Args:
    passwordLength (int): The length of the password to generate
    charToggle (bool): Whether to include special characters in the password

    Returns:
    Response: The generated password
    """
    if (passwordLength is None):
        raise HTTPException(status_code=400, detail="Password length not provided")
    if (charToggle is None):
        raise HTTPException(status_code=400, detail="Character toggle not provided")
    password = gen_pass(passwordLength, charToggle) # Generate password
    print("Generated password: ", password)
    return Response(content=password, media_type="text/plain")

@app.get("/api/set")
async def set_handler():
    return {"message": "Set endpoint"}


