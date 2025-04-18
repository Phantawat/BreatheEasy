import unittest
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class DashboardUITests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.URL = "http://localhost:3000"
        cls.driver = webdriver.Chrome()
        cls.wait = WebDriverWait(cls.driver, 10)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_latest_reports_cards_present(self):
        driver, wait = self.driver, self.wait
        driver.get(self.URL)

        # wait for container
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".dashboard-container")))

        # AQI card
        aqi = driver.find_element(By.CSS_SELECTOR, ".aqi-card")
        self.assertRegex(
            aqi.find_element(By.XPATH, ".//p[strong[contains(text(),'AQI')]]").text,
            r"AQI:\s*\d+"
        )
        self.assertRegex(
            aqi.find_element(By.XPATH, ".//p[strong[contains(text(),'PM2.5')]]").text,
            r"PM2\.5:\s*\d+(\.\d+)?"
        )

        # Sensor card
        sensor = driver.find_element(By.CSS_SELECTOR, ".sensor-card")
        self.assertRegex(
            sensor.find_element(By.XPATH, ".//p[strong[contains(text(),'Temperature')]]").text,
            r"Temperature:\s*\d+(\.\d+)?"
        )
        self.assertRegex(
            sensor.find_element(By.XPATH, ".//p[strong[contains(text(),'PM2.5')]]").text,
            r"PM2\.5:\s*\d+(\.\d+)?"
        )

        # Weather card
        weather = driver.find_element(By.CSS_SELECTOR, ".weather-card")
        self.assertRegex(
            weather.find_element(By.XPATH, ".//p[strong[contains(text(),'Wind Speed')]]").text,
            r"Wind Speed:\s*\d+(\.\d+)?"
        )


if __name__ == "__main__":
    unittest.main()
