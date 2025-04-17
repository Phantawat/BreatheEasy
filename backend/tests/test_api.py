# backend/tests/test_critical_endpoints.py

import unittest
from fastapi.testclient import TestClient
from unittest.mock import patch

from swagger_server.app import app

# A sample “stored” timestamp
SAMPLE_TS = "2025-04-07T20:09:37"

class TestCriticalEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    # 1. Root endpoint
    def test_read_root(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {"message": "Welcome to the Air Quality Monitoring API"})

    # 2. GET /aqicn/latest
    @patch("swagger_server.app.get_latest_aqicn_data")
    def test_aqicn_latest_success(self, mock_latest):
        mock_latest.return_value = {
            "id": 101,
            "ts": SAMPLE_TS,
            "pm25": 12.3,
            "pm10": 25.6,
            "aqi_score": 75
        }
        res = self.client.get("/aqicn/latest")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["id"], 101)
        self.assertEqual(data["ts"], SAMPLE_TS)

    @patch("swagger_server.app.get_latest_aqicn_data")
    def test_aqicn_latest_not_found(self, mock_latest):
        mock_latest.return_value = None
        res = self.client.get("/aqicn/latest")
        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.json()["detail"], "Latest AQICN data not found")

    # 3. GET /aqicn/{id}
    @patch("swagger_server.app.get_aqicn_data_by_id")
    def test_aqicn_by_id_success(self, mock_by_id):
        mock_by_id.return_value = {
            "id": 202,
            "ts": SAMPLE_TS,
            "pm25": 8.1,
            "pm10": 16.2,
            "aqi_score": 60
        }
        res = self.client.get("/aqicn/202")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["id"], 202)
        self.assertEqual(res.json()["ts"], SAMPLE_TS)

    @patch("swagger_server.app.get_aqicn_data_by_id")
    def test_aqicn_by_id_not_found(self, mock_by_id):
        mock_by_id.return_value = None
        res = self.client.get("/aqicn/9999")
        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.json()["detail"], "AQICN data not found")

    # 4. GET /sensor/latest
    @patch("swagger_server.app.get_latest_sensor_data")
    def test_sensor_latest_success(self, mock_s_latest):
        mock_s_latest.return_value = {
            "id": 303,
            "timestamp": SAMPLE_TS,
            "temperature": 24.5,
            "humidity": 55.2,
            "pm25": 4,
            "pm10": 9,
            "latitude": 10.0,
            "longitude": 20.0
        }
        res = self.client.get("/sensor/latest")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["id"], 303)
        self.assertEqual(res.json()["timestamp"], SAMPLE_TS)

    @patch("swagger_server.app.get_latest_sensor_data")
    def test_sensor_latest_not_found(self, mock_s_latest):
        mock_s_latest.return_value = None
        res = self.client.get("/sensor/latest")
        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.json()["detail"], "Latest Sensor data not found")

    # 5. GET /weather/latest
    @patch("swagger_server.app.get_latest_weather_data")
    def test_weather_latest_success(self, mock_w_latest):
        mock_w_latest.return_value = {
            "id": 404,
            "ts": SAMPLE_TS,
            "temperature": 30.0,
            "humidity": 65.0,
            "wind_speed": 5.5
        }
        res = self.client.get("/weather/latest")
        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertEqual(body["id"], 404)
        self.assertEqual(body["ts"], SAMPLE_TS)

    @patch("swagger_server.app.get_latest_weather_data")
    def test_weather_latest_not_found(self, mock_w_latest):
        mock_w_latest.return_value = None
        res = self.client.get("/weather/latest")
        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.json()["detail"], "No weather data found")


if __name__ == "__main__":
    unittest.main()
