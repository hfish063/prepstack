from clerk_backend_api import AuthenticateRequestOptions, Clerk
from fastapi import HTTPException, Request

from app.config import get_settings

settings = get_settings()
clerk = Clerk(bearer_auth=settings.CLERK_SECRET_KEY)

def get_current_user(request: Request):
    state = clerk.authenticate_request(request, AuthenticateRequestOptions(authorized_parties=["http://localhost:3000"]))

    if not state.is_signed_in:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return state
