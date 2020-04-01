import websocket
import datetime
from threading import Thread
import time
import sys
import requests

# account specific values
USERNAME = 'myUserEmail'
PASSWORD = 'myUserPassword'
API_KEY =  'myApplicationApiKey'

# other constants
AUTHENTICATION_HOST = 'https://api.authentication.husqvarnagroup.dev'
SMART_HOST = 'https://api.smart.gardena.dev'

class Client:
    def on_message(self, message):
        x = datetime.datetime.now()
        print("msg ", x.strftime("%H:%M:%S,%f"))
        print(message)
        sys.stdout.flush()

    def on_error(self, error):
        x = datetime.datetime.now()
        print("error ", x.strftime("%H:%M:%S,%f"))
        print(error)

    def on_close(self):
        self.live = False
        x = datetime.datetime.now()
        print("closed ", x.strftime("%H:%M:%S,%f"))
        print("### closed ###")
        sys.exit(0)

    def on_open(self):
        x = datetime.datetime.now()
        print("connected ", x.strftime("%H:%M:%S,%f"))
        print("### connected ###")

        self.live = True

        def run(*args):
            while self.live:
                time.sleep(1)

        Thread(target=run).start()


if __name__ == "__main__":
    payload = {'grant_type': 'password', 'username': USERNAME, 'password': PASSWORD,
               'client_id': API_KEY}

    print("Logging into authentication system...")
    r = requests.post(f'{AUTHENTICATION_HOST}/v1/oauth2/token', data=payload)
    assert r.status_code == 200, r
    auth_token = r.json()["access_token"]
    print("Logged in auth_token=(%s)" % auth_token)
	
    headers = {
        "Content-Type": "application/vnd.api+json",
        "x-api-key": API_KEY,
        "Authorization-Provider": "husqvarna",
        "Authorization": "Bearer " + auth_token
    }

    print("### get locations ###")
    r = requests.get(f'{SMART_HOST}/v1/locations', headers=headers)
    assert r.status_code == 200, r
    assert len(r.json()["data"]) > 0, 'location missing - user has not setup system'
    location_id = r.json()["data"][0]["id"]
    print("LocationId=(%s)" % location_id)

	
    payload = {
        "data": {
            "type": "WEBSOCKET",
            "attributes": {
                "locationId": location_id
            },
            "id": "does-not-matter"
        }
    }
    print("getting WebSocket ID...")
    r = requests.post(f'{SMART_HOST}/v1/websocket', json=payload, headers=headers)

    assert r.status_code == 201, r
    print("WebSocket ID obtained, connecting...")
    response = r.json()
    websocket_url = response["data"]["attributes"]["url"]

    websocket.enableTrace(True)
    client = Client()
    ws = websocket.WebSocketApp(
        websocket_url,
        on_message=client.on_message,
        on_error=client.on_error,
        on_close=client.on_close)
    ws.on_open = client.on_open
    ws.run_forever(ping_interval=150, ping_timeout=1)

