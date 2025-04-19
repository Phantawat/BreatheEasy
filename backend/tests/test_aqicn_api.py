import unittest
from fastapi.testclient import TestClient
from swagger_server.app import app
from unittest.mock import patch

client = TestClient(app)

class TestAQICNAPI(unittest.TestCase):
    
    @patch("swagger_server.app.get_latest_aqicn_data")
    def test_API_002_latest_aqicn(self, mock_data):
        mock_data.return_value = {
            "id": 1,
            "ts": "2025-04-18T08:00:00",
            "pm25": 15.2,
            "pm10": 30.1,
            "aqi_score": 82
        }
        res = client.get("/aqicn/latest")
        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertIn("pm25", body)
        self.assertIn("pm10", body)
        self.assertIn("aqi_score", body)

    def test_API_005_date_empty_result(self):
        res = client.get("/aqicn/date/2025-01-01")
        self.assertIn(res.status_code, (200, 404))

    def test_API_006_get_by_id(self):
        res = client.get("/aqicn/1")
        self.assertIn(res.status_code, (200, 404))  # fallback for missing ID

if __name__ == "__main__":
    unittest.main()
