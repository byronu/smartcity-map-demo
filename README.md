# SmartCity Map

A production-grade, containerized geospatial application that simulates and visualizes live urban data—including traffic sensor readings, public transport positions, and TfL stop arrival predictions. This project serves as a portfolio piece demonstrating full-stack geospatial development skills.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation and Setup](#installation-and-setup)
- [Deployment](#deployment)
- [Usage](#usage)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

SmartCity Map is a full-stack geospatial application that:
- Simulates real-time urban data. and connects to an API for real arrival data from the City of London.
- Visualizes data on an interactive map.
- Uses a robust FastAPI backend with a PostGIS-enabled PostgreSQL database.
- Features a polished React frontend with Material UI and Mapbox GL.
- Is containerized using Docker Compose, enabling a production-grade deployment.

## Features

- **Real-time Data Simulation**  
  - Traffic sensor simulation with randomized speed and congestion levels.
  - Public transport simulation with live bus position updates.
  - TfL stop arrival predictions fetched via the TfL (transport For London) API.
  
- **Interactive Map Visualization**  
  - Mapbox GL-powered interactive map.
  - Custom popups displaying detailed stop and arrival information.
  - Layer toggles, filters, and basemap selector.
  
- **Containerized Architecture**  
  - Backend (FastAPI, PostGIS) and frontend (React) services managed by Docker Compose.
  - Automated build and deployment process.

## Architecture

### Backend

- **API Endpoints:**  
  Provides RESTful endpoints for:
  - Traffic data (from simulated sensors).
  - Public transport data (from simulated bus movements).
  - Live TfL stop arrival data (Pulled via the Transport For London API).
  
- **Database:**  
  A PostGIS-enabled PostgreSQL database stores spatial data.

- **Simulation Scripts:**  
  Python scripts simulate real-time traffic and transport data.

- **Containerization:**  
  Docker and Docker Compose orchestrate backend services for a production-grade environment.

### Frontend

- **React Application:**  
  Built with Create React App, featuring:
  - An interactive map using Mapbox GL.
  - Polished UI components from Material UI.
  
- **Environment Variables:**  
  Uses `.env` files (e.g., `REACT_APP_MAPBOX_TOKEN`) for configuration.

- **Deployment:**  
  Containerized and deployed via Docker Compose, with the frontend served by Nginx.

## Installation and Setup

### Prerequisites

- Docker and Docker Compose
- Git

### Local Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/smartcity-dashboard.git
   cd smartcity-dashboard



Deployment

For continuous deployment, consider using:
	•	Backend: Platforms like Render, DigitalOcean App Platform, or AWS Elastic Beanstalk.
	•	Frontend: Platforms like Vercel or Netlify.

Set up the required environment variables on your deployment platform as described above.

Usage
	•	Frontend URL: http://localhost:8080
	•	Backend API URL: http://localhost:8000

Use the interactive map to:
	•	Toggle data layers (traffic, transport, TfL stops).
	•	View detailed popups with real-time data.
	•	Change basemaps and apply filters.

Technologies
	•	Backend: FastAPI, Python, SQLAlchemy, PostGIS, Docker
	•	Frontend: React, Material UI, Mapbox GL, Axios, Docker
	•	Deployment: Docker Compose

Contributing

Contributions are welcome! Fork the repository, create a feature branch, and submit a pull request with your changes.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Contact

Byron U
GitHub: https://github.com/byronu
