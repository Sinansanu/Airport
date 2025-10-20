from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from BackEnd_Api.API import app as fastapi_app
import uvicorn

# Mount middleware here if needed globally
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = fastapi_app

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
