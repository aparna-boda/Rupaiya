from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, plan, calculator, knowledge, admin

app = FastAPI(title="Rupaiya API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://rupaiya.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(knowledge.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(plan.router, prefix="/api")
app.include_router(calculator.router, prefix="/api")
app.include_router(admin.router, prefix="/api/admin")
