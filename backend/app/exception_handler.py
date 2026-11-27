import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette import status

from app.exceptions import PrepStackError

log = logging.getLogger(__name__)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(PrepStackError)
    async def resource_exception_handler(request: Request, exc: PrepStackError):
        status_code = exc.status_code

        if status_code >= status.HTTP_500_INTERNAL_SERVER_ERROR:
            log.error(f"{request.method} {request.url.path}: {exc.message}")
        else:
            log.info(f"{request.method} {request.url.path}: {exc.message}")

        return JSONResponse(status_code=status_code, content={"detail": exc.message})

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        log.exception(f"Unhandled error on {request.method} {request.url.path}")

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error"},
        )
