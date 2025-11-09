# from fastapi import FastAPI, Depends, HTTPException, Request
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# import jwt

# SECRET_KEY = "33daf8601ac546aace3ec997aa86390b78087a9ed949ebe5be1084d0bf89704d"
# ALGORITHM = "HS256"

# security = HTTPBearer()  # automatically checks Authorization: Bearer <token>

# async def get_current_user(
#     credentials: HTTPAuthorizationCredentials
# ):
#     token = credentials.credentials

#     if not token:
#         raise HTTPException(status_code=404, detail="Token not found")
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         print(payload)
#         user_id = payload.get("user_id")  # or "user_id" depending on your JWT claims
#         if not user_id:
#             raise HTTPException(status_code=401, detail="Invalid token")
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token expired")
#     except jwt.InvalidTokenError:
#         raise HTTPException(status_code=401, detail="Invalid token")

#     # optionally, fetch user from DB here using user_id
#     return user_id  # return full payload or just user_id

# app = FastAPI()

# @app.get("/api/home")
# async def home(user=Depends(get_current_user)):
#     return {"message": f"Hello user {user['user_id']}"}


from fastapi import FastAPI, HTTPException, Request
import jwt

SECRET_KEY = "33daf8601ac546aace3ec997aa86390b78087a9ed949ebe5be1084d0bf89704d"
ALGORITHM = "HS256"

app = FastAPI()


async def get_current_user(request: Request):
    auth_header = request.headers.get("authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = auth_header.split(" ")[1]

    print(token)

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("Decoded JWT payload:", payload)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload  # You can return the whole payload or just user_id


@app.get("/api/home")
async def home(request: Request):
    user = await get_current_user(request)
    return {"message": f"Hello user {user.get('id')}", "payload": user}
