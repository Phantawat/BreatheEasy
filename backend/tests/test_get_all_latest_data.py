# backend/tests/test_dashboard_api.py

import unittest
from fastapi.testclient import TestClient
from unittest.mock import patch

from swagger_server.app import app

# A static sample timestamp for all mocks
SAMPLE_TS = "2025-04-07T20:09:37"

class TestDashboardAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    @patch("swagger_server.app.get_latest_aqicn_data")
    @patch("swagger_server.app.get_latest_sensor_data")
    @patch("swagger_server.app.get_latest_weather_data")
    def test_read_latest_reports(self, mock_w, mock_s, mock_a):
        # Arrange: stub each controller
        mock_a.return_value = {
            "id": 1, "ts": SAMPLE_TS, "pm25": 10.0, "pm10": 20.0, "aqi_score": 50
        }
        mock_s.return_value = {
            "id": 2, "ts": SAMPLE_TS, "temperature": 22.5,
            "humidity": 55.0, "pm25": 5, "pm10": 10, "latitude": 0, "longitude": 0
        }
        mock_w.return_value = {
            "id": 3, "ts": SAMPLE_TS, "temperature": 25.0, "humidity": 60.0, "wind_speed": 3.5
        }

        # Act: hit each “latest” endpoint
        res_a = self.client.get("/aqicn/latest")
        res_s = self.client.get("/sensor/latest")
        res_w = self.client.get("/weather/latest")

        # Assert status codes
        self.assertEqual(res_a.status_code, 200)
        self.assertEqual(res_s.status_code, 200)
        self.assertEqual(res_w.status_code, 200)

        # Assert payload shapes & values
        a = res_a.json()
        self.assertEqual(a["pm25"], 10.0)
        self.assertEqual(a["ts"], SAMPLE_TS)

        s = res_s.json()
        self.assertEqual(s["temperature"], 22.5)
        self.assertEqual(s["timestamp"], SAMPLE_TS)

        w = res_w.json()
        self.assertEqual(w["wind_speed"], 3.5)
        self.assertEqual(w["ts"], SAMPLE_TS)

    @patch("swagger_server.app.get_latest_aqicn_data", return_value=None)
    def test_aqicn_latest_not_found(self, mock_a):
        res = self.client.get("/aqicn/latest")
        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.json()["detail"], "Latest AQICN data not found")

    @patch("swagger_server.app.get_latest_sensor_data", return_value=None)
    def test_sensor_latest_not_found(self, mock_s):
        res = self.client.get("/sensor/latest")
        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.json()["detail"], "Latest Sensor data not found")

    @patch("swagger_server.app.get_latest_weather_data", return_value=None)
    def test_weather_latest_not_found(self, mock_w):
        res = self.client.get("/weather/latest")
        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.json()["detail"], "No weather data found")


if __name__ == "__main__":
    unittest.main()
