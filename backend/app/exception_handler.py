from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.exceptions import PrepStackError


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(PrepStackError)
    async def resource_exception_handler(request: Request, exc: PrepStackError):
        status_code = exc.status_code

        return JSONResponse(status_code=status_code, content={"detail": exc.message})
