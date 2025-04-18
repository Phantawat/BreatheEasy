import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

class AQICNUITests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.URL = "http://localhost:3000"
        cls.driver = webdriver.Chrome()
        cls.wait = WebDriverWait(cls.driver, 20)  # extended for slow API

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def wait_until_dropdown_has_options(self, select_locator, timeout=20):
        """Wait until the dropdown has at least 1 option (excluding default/empty)."""
        end_time = time.time() + timeout
        while time.time() < end_time:
            try:
                sel = Select(self.driver.find_element(*select_locator))
                options = sel.options
                if len(options) > 0:
                    return sel
            except Exception:
                pass
            time.sleep(0.5)
        self.fail("Dropdown never populated with options.")

    def test_UI_001_load_title(self):
        """UI_001: Load AQICN page and verify title exists"""
        self.driver.get(f"{self.URL}/aqicn")
        title = self.wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "aqicn-page-title")))
        self.assertIn("AQICN Dashboard", title.text)


    def test_UI_002_latest_data_card(self):
        """UI_005: Verify latest air quality section renders with data"""
        self.driver.get(f"{self.URL}/aqicn")

        card = self.wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "aqicn-details")))
        content = card.text.lower()

        self.assertIn("pm2.5", content)
        self.assertIn("pm10", content)
        self.assertIn("aqi", content)


    def test_UI_003_submit_disables_on_loading(self):
        """UI_006: Submit button shows loading text and disables on click"""
        self.driver.get(f"{self.URL}/aqicn")
        sel = self.wait_until_dropdown_has_options((By.ID, "date-picker"))
        sel.select_by_index(0)

        button = self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        button.click()

        self.assertTrue(button.get_attribute("disabled"))
        self.assertIn("Loading", button.text)


    def test_UI_004_chart_is_displayed(self):
        """UI_004: Verify that the PM2.5 chart container is displayed"""
        self.driver.get(f"{self.URL}/aqicn")
        chart = self.wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "aqicn-chart-container")))
        self.assertTrue(chart.is_displayed(), "Chart container is not visible.")

if __name__ == "__main__":
    unittest.main()
