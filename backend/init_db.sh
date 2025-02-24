#!/bin/bash
set -e

# Export the password for non‑interactive authentication from environment variable
export PGPASSWORD=${POSTGRES_PASSWORD}

# Wait for PostgreSQL to be ready.
until pg_isready -h db -p 5432 -U ${POSTGRES_USER}; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

echo "PostgreSQL is ready. Creating tables..."

psql -h db -U ${POSTGRES_USER} -d ${POSTGRES_DB} <<EOF
CREATE TABLE IF NOT EXISTS traffic_sensors (
    id SERIAL PRIMARY KEY,
    sensor_id VARCHAR(50) NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    current_speed NUMERIC,
    congestion_level VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public_transport (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL,
    route VARCHAR(50),
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    occupancy INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

echo "Tables created successfully."