# PrevBike
An application to 

## Project Structure
### - ```backend/```
Java Spring Boot application serving as the API for the web application.

### - ```frontend/```
React app: to be implemented

### - ```data_fetcher/```
Python application that fetches bike data and saves it in a Postgres / Postgis database.


## .env variables
- POSTGRES_DB: database name of local postgres db 
- POSTGRES_USER: username of local postgres db
- POSTGRES_PASSWORD: password for specified db user
- API_URL: URL to fetch the bike data from in json format
- TIMEZONE: local timezone (e.g. "Europe/Berlin")

## Installation / Getting Started
- Postgres: start with docker compose
- Python data fetcher: start with docker compose
- Spring Boot backend: 1. Run gradle task "bootJar" in "backend" folder to build spring project. 2. Start with docker compose. (Or use run configuration)
