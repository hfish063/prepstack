from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.exception_handler import register_exception_handlers
from app.lifespan import lifespan
from app import api

app = FastAPI(lifespan=lifespan)
register_exception_handlers(app)
app.include_router(api.router)

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
