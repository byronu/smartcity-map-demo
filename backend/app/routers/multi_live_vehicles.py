import asyncio
import httpx
import os
from fastapi import APIRouter, HTTPException

router = APIRouter()

# For this portfolio project, we only use Bond Street
STOP_IDS = [
    "940GZZLUBND"  # Bond Street (group stop – will pick an individual stop if available)
]

@router.get("/", response_model=dict)
async def get_multi_live_vehicles():
    # TfL API credentials from environment variables
    params = {
        "app_id": os.getenv("TFL_APP_ID"),
        "app_key": os.getenv("TFL_APP_KEY")
    }
    
    async def fetch_stop_data(stop_id: str) -> dict:
        async with httpx.AsyncClient() as client:
            # Get stop details
            stop_details_url = f"https://api.tfl.gov.uk/StopPoint/{stop_id}"
            stop_resp = await client.get(stop_details_url, params=params)
            stop_resp.raise_for_status()
            stop_data = stop_resp.json()
            
            # Determine if this stop is a group stop.
            # TfL’s individual stops usually have the fourth character as "0".
            selected_stop_id = stop_id
            selected_lat = None
            selected_lon = None
            if "children" in stop_data and stop_data["children"]:
                for child in stop_data["children"]:
                    child_id = child.get("id", "")
                    if len(child_id) >= 4 and child_id[3] == "0":
                        selected_stop_id = child_id
                        selected_lat = child.get("lat")
                        selected_lon = child.get("lon")
                        break
            # Fallback to group stop’s coordinates if no child found
            if selected_lat is None or selected_lon is None:
                selected_lat = stop_data.get("lat")
                selected_lon = stop_data.get("lon")
            
            if selected_lat is None or selected_lon is None:
                raise HTTPException(status_code=500, detail=f"Coordinates not available for stop {stop_id}")
            
            # Fetch arrivals for the selected (individual) stop id
            arrivals_url = f"https://api.tfl.gov.uk/StopPoint/{selected_stop_id}/Arrivals"
            arrivals_resp = await client.get(arrivals_url, params=params)
            arrivals_resp.raise_for_status()
            arrivals_data = arrivals_resp.json()
            
            # Attach the coordinates to each arrival prediction
            for arrival in arrivals_data:
                arrival["latitude"] = selected_lat
                arrival["longitude"] = selected_lon
            
            # Sort arrivals by timeToStation and take the next 3 arrivals
            sorted_arrivals = sorted(arrivals_data, key=lambda a: a.get("timeToStation", float('inf')))
            next_three = sorted_arrivals[:3]
            
            return {
                "stop_id": selected_stop_id,
                "stop_name": stop_data.get("commonName", "Unknown Stop"),
                "lat": selected_lat,
                "lon": selected_lon,
                "arrivals": next_three
            }
    
    try:
        # For this project, only fetch data for Bond Street
        results = await asyncio.gather(*(fetch_stop_data(stop_id) for stop_id in STOP_IDS))
        
        features = []
        for res in results:
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [res["lon"], res["lat"]]
                },
                "properties": {
                    "stop_id": res["stop_id"],
                    "stop_name": res["stop_name"],
                    "arrivals": res["arrivals"]
                }
            }
            features.append(feature)
        
        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        return geojson
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))