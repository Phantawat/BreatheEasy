# frontend/tests/test_navigation.py

import unittest
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class NavigationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Make sure your React app is running on this URL!
        cls.URL = "http://localhost:3000"
        cls.driver = webdriver.Chrome()
        cls.wait = WebDriverWait(cls.driver, 10)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_page_navigation(self):
        driver = self.driver
        wait = self.wait

        # 1) Load the app
        driver.get(self.URL)

        # 2) Wait for the navbar to mount
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".nav-links")))

        # 3) AQICN
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/aqicn']"))).click()
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "aqicn-page-title")))
        self.assertIn("AQICN Dashboard", driver.page_source)

        # 4) Sensor
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/sensor']"))).click()
        # SensorPage uses <h1 className="page-title">
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "page-title")))
        self.assertIn("Sensor Dashboard", driver.page_source)

        # 5) Weather
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/weather']"))).click()
        # WeatherPage also uses <h1 className="page-title">
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "page-title")))
        self.assertIn("Weather Dashboard", driver.page_source)

    def test_date_selection_and_table_display(self):
        driver = self.driver
        wait = self.wait

        for page in ("aqicn", "sensor", "weather"):
            driver.get(f"{self.URL}/{page}")

            # Wait for the date‑picker control
            wait.until(EC.presence_of_element_located((By.ID, "date-picker")))

            # Pick the first available date
            select = Select(driver.find_element(By.ID, "date-picker"))
            options = select.options
            if options:
                select.select_by_index(0)
                # Submit the form
                driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
                # Give the table a moment to render
                time.sleep(2)
                # Fail if it still says “No data available”
                self.assertNotIn("No data available", driver.page_source,
                                 f"Page {page}: expected at least some data in table")

if __name__ == "__main__":
    unittest.main()
