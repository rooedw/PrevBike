import requests
import json
import os

from dotenv import load_dotenv  # pip install python-dotenv

# Load variables from .env into environment
load_dotenv()


FLEXZONE_API_URL = os.getenv("FLEXZONE_API_URL")
CITY_INFO_JSON_FILE_PATH = os.getenv("CITY_INFO_JSON_FILE_PATH")
BIKES_API_URL = os.getenv("API_URL")


def fetch_data(api_url):
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json()
        print(f"DATA FETCHED FROM {api_url}")
        return data
    else:
        print(f"Failed to fetch data: {response.status_code}")
        return None

def convert_data(flexzone_data, cities_data):

    # Don't update if hash is the same
    data_hash = flexzone_data['geojson']['hash']
    try:
        with open(CITY_INFO_JSON_FILE_PATH, "r") as f:
            data = json.load(f)
            old_hash = data['hash']
    except Exception as e:
        old_hash = ""
    if old_hash == data_hash:
        print("hash is old. exiting")
        exit(0)

    # Get mapping from cities to regions and townIds
    cities = []
    townId_to_region_name = {}
    for region in cities_data['countries']:
        for city in region['cities']:
            town_id = int(city['uid'])
            townId_to_region_name[town_id] = region['name']
            city_entry = {
                "cityName": city['name'],
                "townId": town_id,
                "regionName": region['name'],
                "lat": city['lat'],
                "lon": city['lng']
            }
            cities.append(city_entry)

    # Get mapping from regions to flexzones
    flexzones_dict = {}
    for feature in flexzone_data['geojson']['nodeValue']['features']:
        if feature["geometry"]["type"] != "Polygon":
            continue
        coordinates = feature["geometry"]["coordinates"]  # list of lat-lon-list

        town_id = int(feature['properties']['cityId'])
        category = feature['properties']['category']

        zone = {"category": category, "coordinates" : coordinates}

        if town_id not in townId_to_region_name.keys():
            continue
        region_name = townId_to_region_name[town_id]

        if region_name in flexzones_dict:
            flexzones_dict[region_name]['zones'].append(zone)
        else:
            flexzones_dict[region_name] = {"zones": [zone]}

    flexzones = [
        {**value, "regionName": key} for key, value in flexzones_dict.items()
    ]

    return data_hash, cities, flexzones


def save_data(data_hash, cities, flexzones):
    json_dict = {
        "hash": data_hash,
        "cities": cities,
        "flexzones": flexzones
    }

    with open(CITY_INFO_JSON_FILE_PATH, "w") as f:
        json.dump(json_dict, f, indent=2)

    print("json saved")


if __name__ == '__main__':
    flexzone_data = fetch_data(FLEXZONE_API_URL)
    cities_data = fetch_data(BIKES_API_URL)
    data_hash, cities, flexzones = convert_data(flexzone_data, cities_data)
    save_data(data_hash, cities, flexzones)
