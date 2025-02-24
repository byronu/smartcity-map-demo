from dotenv import load_dotenv
load_dotenv()

import asyncio
import random
from datetime import datetime
from sqlalchemy import create_engine, text
import os
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment!")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Simulate 10 vehicles (buses)
vehicle_ids = [f"V{i}" for i in range(1, 11)]
routes = ['Route A', 'Route B', 'Route C']

def random_coord():
    lon = random.uniform(-0.5, 0.1)
    lat = random.uniform(51.4, 51.7)
    return (lon, lat)

vehicle_positions = {vehicle: random_coord() for vehicle in vehicle_ids}

async def simulate_transport_data():
    while True:
        for vehicle in vehicle_ids:
            current_lon, current_lat = vehicle_positions[vehicle]
            delta_lon = random.uniform(-0.001, 0.001)
            delta_lat = random.uniform(-0.001, 0.001)
            new_lon = current_lon + delta_lon
            new_lat = current_lat + delta_lat
            new_lon = max(min(new_lon, 0.1), -0.5)
            new_lat = max(min(new_lat, 51.7), 51.4)
            vehicle_positions[vehicle] = (new_lon, new_lat)

            occupancy = random.randint(0, 100)
            now = datetime.now()

            insert_query = text("""
                INSERT INTO public_transport (vehicle_id, route, location, occupancy, updated_at)
                VALUES (:vehicle, :route, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :occupancy, :now);
            """)
            delete_query = text("""
                DELETE FROM public_transport
                WHERE vehicle_id = :vehicle
                  AND id NOT IN (
                    SELECT id FROM public_transport
                    WHERE vehicle_id = :vehicle
                    ORDER BY updated_at DESC
                    LIMIT 1
                  );
            """)
            params = {
                "vehicle": vehicle,
                "route": random.choice(routes),
                "lon": new_lon,
                "lat": new_lat,
                "occupancy": occupancy,
                "now": now
            }
            max_retries = 5
            retry_count = 0
            while retry_count < max_retries:
                try:
                    with engine.begin() as conn:
                        conn.execute(insert_query, params)
                        conn.execute(delete_query, {"vehicle": vehicle})
                        result = conn.execute(text("SELECT COUNT(*) FROM public_transport WHERE vehicle_id = :vehicle"), {"vehicle": vehicle})
                        count = result.scalar()
                        logger.info(f"Vehicle {vehicle}: {count} row")
                    break
                except Exception as e:
                    retry_count += 1
                    logger.error(f"Error updating vehicle {vehicle}: {e}. Retrying in 2 seconds... (Attempt {retry_count}/{max_retries})")
                    time.sleep(2)
            if retry_count == max_retries:
                logger.error(f"Failed to update vehicle {vehicle} after {max_retries} attempts.")
        logger.info(f"Transport data updated at {datetime.now()}")
        await asyncio.sleep(7)

if __name__ == "__main__":
    asyncio.run(simulate_transport_data())