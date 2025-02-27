# fetches data from API and saves into DB
# uses env variable API_URL
import os
import psycopg2
from psycopg2 import sql

table_name = "bike_positions"


DB_NAME = os.getenv("POSTGRES_DB")
DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_HOST = os.getenv("POSTGRES_HOST")
DB_PORT = os.getenv("POSTGRES_PORT")
API_URL = os.getenv("API_URL")

connection = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)

#cursor = connection.cursor()

#cursor.execute("SELECT * from portal.portal_users;")

# Fetch all rows from database
#record = cursor.fetchall()

#print("Data from Database:- ", record)

def fetchDate():
    pass

def loop():
    if not table_exists():
        createDB()


def saveData():
    pass

def convertData():
    pass

def createDB():
    query = sql.SQL(f"""
        CREATE TABLE {table_name} (
          entryId INTEGER PRIMARY KEY,
          townId INTEGER NOT NULL,
          bikeID INTEGER NOT NULL,
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
    print(query)
    cursor.execute(query)
    exists = cursor.fetchone()[0]
    cursor.close()
    print(f"TABLE EXISTS? {exists}")
    return exists


if __name__ == '__main__':
    print("STARTED FETCHER")
    loop()
    connection.close()


# psql -h localhost -p 5432 -U myuser -d prevbikedb
