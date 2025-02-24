from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.dependencies import get_db
import json

router = APIRouter()

@router.get("/", response_model=dict)
def get_traffic(limit: int = 100, db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT id, sensor_id, ST_AsGeoJSON(location) as geojson, current_speed, congestion_level, updated_at 
            FROM traffic_sensors 
            ORDER BY updated_at DESC
            LIMIT :limit
        """)
        result = db.execute(query, {"limit": limit})
        features = []
        for row in result:
            feature = {
                "type": "Feature",
                "geometry": json.loads(row.geojson),
                "properties": {
                    "id": row.id,
                    "sensor_id": row.sensor_id,
                    "current_speed": float(row.current_speed) if row.current_speed is not None else None,
                    "congestion_level": row.congestion_level,
                    "updated_at": row.updated_at.isoformat() if row.updated_at else None
                }
            }
            features.append(feature)
        return {"type": "FeatureCollection", "features": features}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/summary", response_model=dict)
def get_traffic_summary(db: Session = Depends(get_db)):
    try:
        # Use DISTINCT ON to fetch the latest record per sensor.
        query = text("""
            SELECT DISTINCT ON (sensor_id) id, sensor_id, ST_AsGeoJSON(location) as geojson, current_speed, congestion_level, updated_at
            FROM traffic_sensors
            ORDER BY sensor_id, updated_at DESC;
        """)
        result = db.execute(query)
        summary = []
        for row in result:
            summary.append({
                "type": "Feature",
                "geometry": json.loads(row.geojson),
                "properties": {
                    "id": row.id,
                    "sensor_id": row.sensor_id,
                    "current_speed": float(row.current_speed) if row.current_speed is not None else None,
                    "congestion_level": row.congestion_level,
                    "updated_at": row.updated_at.isoformat() if row.updated_at else None
                }
            })
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@router.get("/{sensor_id}", response_model=dict)
def get_sensor_history(sensor_id: str, db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT sensor_id, current_speed, congestion_level, updated_at 
            FROM traffic_sensors
            WHERE sensor_id = :sensor_id
            ORDER BY updated_at DESC
            LIMIT 10
        """)
        result = db.execute(query, {"sensor_id": sensor_id})
        history = [dict(row) for row in result]
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))