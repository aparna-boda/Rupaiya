from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.config import settings

security = HTTPBearer(auto_error=False)
TOKEN_HOURS = 8


def create_admin_token() -> tuple[str, str]:
    expires = datetime.now(timezone.utc) + timedelta(hours=TOKEN_HOURS)
    payload = {"role": "admin", "exp": expires}
    token = jwt.encode(payload, settings.jwt_secret, algorithm="HS256")
    return token, expires.isoformat()


def verify_admin_token(token: str) -> bool:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        return payload.get("role") == "admin"
    except jwt.PyJWTError:
        return False


def require_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> None:
    if credentials is None or not verify_admin_token(credentials.credentials):
        raise HTTPException(status_code=401, detail="Unauthorized")
