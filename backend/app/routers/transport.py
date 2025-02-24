from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.dependencies import get_db
import json

router = APIRouter()

@router.get("/", response_model=dict)
def get_transport(limit: int = 100, db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT vehicle_id, route, ST_AsGeoJSON(location) as geojson, occupancy, updated_at 
            FROM public_transport 
            ORDER BY updated_at DESC
            LIMIT :limit
        """)
        result = db.execute(query, {"limit": limit})
        features = []
        for row in result:
            features.append({
                "type": "Feature",
                "geometry": json.loads(row.geojson),
                "properties": {
                    "vehicle_id": row.vehicle_id,
                    "route": row.route,
                    "occupancy": row.occupancy,
                    "updated_at": row.updated_at.isoformat() if row.updated_at else None
                }
            })
        return {"type": "FeatureCollection", "features": features}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/summary", response_model=dict)
def get_transport_summary(db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT DISTINCT ON (vehicle_id) vehicle_id, route, ST_AsGeoJSON(location) as geojson, occupancy, updated_at
            FROM public_transport
            ORDER BY vehicle_id, updated_at DESC;
        """)
        result = db.execute(query)
        summary = []
        for row in result:
            summary.append({
                "type": "Feature",
                "geometry": json.loads(row.geojson),
                "properties": {
                    "vehicle_id": row.vehicle_id,
                    "route": row.route,
                    "occupancy": row.occupancy,
                    "updated_at": row.updated_at.isoformat() if row.updated_at else None
                }
            })
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))