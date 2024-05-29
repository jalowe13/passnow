import os
from fastapi import FastAPI, Response


app = FastAPI()
@app.get("/")
async def root():
    return {"message": "Hello World"}
