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

async def simulate_traffic_data():
    # Generate 20 sensor IDs: TS1, TS2, ... TS20
    sensor_ids = [f"TS{i}" for i in range(1, 21)]
    # Generate fixed coordinates for each sensor near central London.
    sensor_positions = {}
    for sensor in sensor_ids:
        lon = random.uniform(-0.15, 0.15) - 0.1278
        lat = random.uniform(-0.15, 0.15) + 51.5074
        sensor_positions[sensor] = (lon, lat)
    
    while True:
        for sensor in sensor_ids:
            speed = round(random.uniform(20, 80), 2)
            congestion = random.choice(['low', 'moderate', 'high'])
            # Use fixed coordinates
            lon, lat = sensor_positions[sensor]
            now = datetime.now()
            
            insert_query = text("""
                INSERT INTO traffic_sensors (sensor_id, location, current_speed, congestion_level, updated_at)
                VALUES (:sensor, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :speed, :congestion, :now);
            """)
            # Keep only the most recent record per sensor.
            delete_query = text("""
                DELETE FROM traffic_sensors
                WHERE sensor_id = :sensor
                  AND id NOT IN (
                    SELECT id FROM traffic_sensors
                    WHERE sensor_id = :sensor
                    ORDER BY updated_at DESC
                    LIMIT 1
                  );
            """)
            params = {
                "sensor": sensor,
                "lon": lon,
                "lat": lat,
                "speed": speed,
                "congestion": congestion,
                "now": now
            }
            max_retries = 5
            retry_count = 0
            while retry_count < max_retries:
                try:
                    with engine.begin() as conn:
                        conn.execute(insert_query, params)
                        conn.execute(delete_query, {"sensor": sensor})
                        result = conn.execute(text("SELECT COUNT(*) FROM traffic_sensors WHERE sensor_id = :sensor"), {"sensor": sensor})
                        count = result.scalar()
                        logger.info(f"Sensor {sensor}: {count} row")
                    break
                except Exception as e:
                    retry_count += 1
                    logger.error(f"Error updating sensor {sensor}: {e}. Retrying in 2 seconds... (Attempt {retry_count}/{max_retries})")
                    time.sleep(2)
            if retry_count == max_retries:
                logger.error(f"Failed to update sensor {sensor} after {max_retries} attempts.")
        logger.info(f"Traffic data updated at {datetime.now()}")
        await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(simulate_traffic_data())