import os
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware


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



@app.get("/")
async def root():
    return {"message": "Hello World!!!"}

@app.get("/api/button-clicked")
async def button_clicked_handler():
    print("Button was clicked right now!")
    return {"message": "Button was clicked right now!"}

@app.get("/api/set")
async def set_handler():
    return {"message": "Set endpoint"}
