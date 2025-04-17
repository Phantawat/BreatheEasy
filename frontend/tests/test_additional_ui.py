import unittest
import re
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class AdditionalUITests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.URL = "http://localhost:3000"
        cls.driver = webdriver.Chrome()
        cls.wait = WebDriverWait(cls.driver, 10)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_aqicn_threshold_legend_and_datepicker(self):
        driver, wait = self.driver, self.wait
        driver.get(f"{self.URL}/aqicn")

        # Wait for the threshold legend card
        legend = wait.until(EC.presence_of_element_located(
            (By.XPATH, "//h2[contains(text(),'PM2.5 Threshold Legend')]/..")
        ))
        # It should contain six list items
        items = legend.find_elements(By.TAG_NAME, "li")
        self.assertEqual(len(items), 6,
                         f"Expected 6 legend entries, found {len(items)}")

        # Check first & last item text and color style
        first = items[0].find_element(By.TAG_NAME, "strong")
        self.assertRegex(first.text, r"Green", "First legend item wrong")
        self.assertIn("color: green", first.get_attribute("style"))

        last = items[-1].find_element(By.TAG_NAME, "strong")
        self.assertRegex(last.text, r"Maroon", "Last legend item wrong")
        self.assertIn("color: maroon", last.get_attribute("style"))

        # Date picker populated with at least one <option>
        select = wait.until(EC.presence_of_element_located((By.ID, "date-picker")))
        options = select.find_elements(By.TAG_NAME, "option")
        self.assertGreater(len(options), 0, "Date picker has no options")
        # Check option values look like YYYY-MM-DD
        pattern = re.compile(r"\d{4}-\d{2}-\d{2}")
        self.assertTrue(all(pattern.match(opt.get_attribute("value")) for opt in options),
                        "Some date options do not match YYYY-MM-DD")

    def test_aqicn_charts_render_two_series(self):
        driver, wait = self.driver, self.wait
        driver.get(f"{self.URL}/aqicn")

        # Wait for both chart containers
        wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "aqicn-chart-container")))

        # Count all the line-curve <path> elements (one per series per chart)
        time.sleep(1)  # let the SVG finish rendering
        paths = driver.find_elements(By.CSS_SELECTOR, ".recharts-line-curve")
        # We have two charts (PM2.5 & PM10), each with exactly one series
        self.assertEqual(len(paths), 2,
                         f"Expected 2 line series across charts, found {len(paths)}")

    def test_dashboard_summary_and_links(self):
        driver, wait = self.driver, self.wait
        driver.get(self.URL)

        # Wait for the smart summary card
        summary = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".summary-report")))
        paragraphs = summary.find_elements(By.TAG_NAME, "p")
        # Should have at least three summary lines
        self.assertGreaterEqual(len(paragraphs), 3,
                                f"Expected ≥3 summary lines, got {len(paragraphs)}")
        # Check each starts with an emoji marker
        for p in paragraphs:
            self.assertRegex(p.text, r"^[\u2600-\u26FF\ud83c\udf00-\udfff].+",
                             f"Summary line doesn’t start with emoji: {p.text}")

        # Check the data‑links
        links_ul = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".data-links")))
        items = links_ul.find_elements(By.TAG_NAME, "li")
        self.assertEqual(len(items), 3, f"Expected 3 data links, found {len(items)}")

        # Titles & hrefs
        expected = {
            "View All AQI Data": "/aqicn",
            "View All Sensor Data": "/sensor",
            "View All Weather Data": "/weather"
        }
        for li in items:
            a = li.find_element(By.TAG_NAME, "a")
            text = a.text.strip()
            self.assertIn(text, expected, f"Unexpected link text: {text}")
            self.assertEqual(a.get_attribute("href").rstrip("/"), self.URL + expected[text])

if __name__ == "__main__":
    unittest.main()
