# fetches data from API and saves into DB
# uses env variable API_URL
import os
import time
import datetime

import psycopg2
from psycopg2 import sql
from psycopg2.extras import execute_batch
import requests
import pytz

table_name = "bike_positions"


DB_NAME = os.getenv("POSTGRES_DB")
DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_HOST = os.getenv("POSTGRES_HOST")
DB_PORT = os.getenv("POSTGRES_PORT")
API_URL = os.getenv("API_URL")
TIMEZONE = os.getenv("TIMEZONE")

connection = None

def create_db_connection():
    max_connection_attempts = 10
    connection_attempts = 0

    global connection

    while connection_attempts < max_connection_attempts:
        try:
            connection = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
            print("Successfully connected to the database.")
            break
        except psycopg2.Error as e:
            print(f"Failed to connect to the database (attempt {connection_attempts + 1}): {e}")
            connection_attempts += 1
            if connection_attempts < max_connection_attempts:
                print("Retrying in 3 seconds...")
                time.sleep(3)

    if connection is None:
        print("Failed to connect to the database after multiple attempts. Exiting.")
        exit()


def fetch_data():
    response = requests.get(API_URL)
    if response.status_code == 200:
        data = response.json()
        print("DATA FETCHED")
        return data
    else:
        print(f"Failed to fetch data: {response.status_code}")
        return None


def sleep_next_minute():
    # sleep until next minute
    now = datetime.datetime.now()
    next_minute = (now + datetime.timedelta(minutes=1)).replace(second=0, microsecond=0)
    sleep_until = (next_minute - now).total_seconds()
    print(f"Sleeping for {sleep_until:.2f} seconds until the next full minute...")
    time.sleep(sleep_until)


def loop():
    f"""
    fetches the data every 1 minute and saves it to the database using the convert_data and save_data methods
    """
    if not table_exists():
        create_db()

    try:
        while True:
            sleep_next_minute()
            data = fetch_data()
            if data:
                converted_data = convert_data(data)
                save_data(converted_data)
    except KeyboardInterrupt:
        print("Process interrupted by user")
    finally:
        connection.close()
        print("DB connection closed.")


def convert_data(json_data):
    cities = [city for country in json_data["countries"] for city in country["cities"]]

    timestamp = datetime.datetime.now(pytz.utc).astimezone(pytz.timezone(TIMEZONE)).replace(second=0, microsecond=0, tzinfo=None)

    converted_data = []
    for city in cities:
        town_id = int(city['uid'])
        for place in city['places']:

            lng = place['lng']
            lat = place['lat']
            if place['bike']:
                # if bike
                assert len(place['bike_numbers']) == 1
                bike_id = int(place['bike_numbers'][0])
                converted_data.append((town_id, bike_id, lng, lat, timestamp))

            else:
                # if station
                bike_ids = place['bike_numbers']
                for bike_id in bike_ids:
                    bike_id = int(bike_id)
                    converted_data.append((town_id, bike_id, lng, lat, timestamp))

    return converted_data

def save_data(converted_data):
    cursor = connection.cursor()

    query = f"""
        INSERT INTO {table_name} (townId, bikeId, location, timestamp)
        VALUES (%s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s)
    """

    execute_batch(cursor, query, converted_data)  # Efficient batch insert

    connection.commit()
    cursor.close()


def create_db():
    query = sql.SQL(f"""
        CREATE TABLE {table_name} (
          entryId SERIAL PRIMARY KEY,
          townId INTEGER NOT NULL,
          bikeId INTEGER NOT NULL,
          location GEOGRAPHY(Point, 4326),  -- Geografischer Punkt mit SRID 4326 (WGS 84)
          timestamp TIMESTAMP WITHOUT TIME ZONE
        );
        CREATE INDEX idx_{table_name}_location ON {table_name} USING GIST(location);
        CREATE INDEX idx_{table_name}_town_id ON {table_name} (townId);
        CREATE INDEX idx_{table_name}_weekday ON {table_name} (EXTRACT(DOW FROM timestamp));
        CREATE INDEX idx_{table_name}_hour ON {table_name} (EXTRACT(HOUR FROM timestamp));

        CREATE INDEX idx_{table_name}_weekday_hour ON {table_name} (
            EXTRACT(DOW FROM timestamp),
            EXTRACT(HOUR FROM timestamp)
        );

        CREATE INDEX idx_{table_name}_town_location_weekday_hour ON {table_name} (
            townId,
            location,
            EXTRACT(DOW FROM timestamp),
            EXTRACT(HOUR FROM timestamp)
         );
    """)

    cursor = connection.cursor()
    cursor.execute(query)
    connection.commit()
    cursor.close()
    print("CREATED TABLE")

def table_exists():
    cursor = connection.cursor()
    query = sql.SQL(f"""
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = '{table_name}'
        );
    """)
    cursor.execute(query)
    exists = cursor.fetchone()[0]
    cursor.close()
    print(f"TABLE EXISTS? {exists}")
    return exists


if __name__ == '__main__':
    print("STARTED FETCHER")
    create_db_connection()
    loop()
    connection.close()


# psql -h localhost -p 5432 -U myuser -d prevbikedb
