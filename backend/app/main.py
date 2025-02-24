from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import traffic, transport, multi_live_vehicles

app = FastAPI(
    title="Smart City Dashboard API",
    description="API for real-time Smart City Traffic & Infrastructure data",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(traffic.router, prefix="/api/traffic", tags=["Traffic"])
app.include_router(transport.router, prefix="/api/transport", tags=["Transport"])
app.include_router(multi_live_vehicles.router, prefix="/api/multi-live-vehicles", tags=["LiveStops"])

@app.get("/")
def root():
    return {"message": "Welcome to the Smart City Dashboard API"}