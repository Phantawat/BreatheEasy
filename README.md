# 🌿 BreatheEasy

**BreatheEasy** is a real-time indoor air quality monitoring system that collects and visualizes sensor data (temperature, humidity, PM2.5, PM10), integrates outdoor AQI and weather data, and provides health-related insights and predictions.

---
## 📖 Background

Air pollution and poor indoor air quality have become serious health concerns. BreatheEasy was developed to provide users with real-time insight into their indoor environment and compare it with outdoor conditions.

This project combines data from:
- PMS7003: PM2.5/PM10 sensor for particulate levels
- KY-015: Temperature & Humidity sensor
- AQICN API: Outdoor air quality
- OpenWeatherMap API: Local weather conditions

It also features air quality forecasting using predictive models.

---

## ✨ Features

- 📟 Real-time indoor sensor dashboard
- 🌬️ Outdoor AQI comparison from AQICN
- 🌦️ Weather insights (temperature, humidity, wind)
- 📈 Forecast page (temperature, humidity, PM2.5, PM10)
- 🧠 AI models for indoor/outdoor air quality prediction
- 📊 Threshold-based legends and smart health summaries

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Phantawat/BreatheEasy.git
cd BreatheEasy
```

### 2. Backend Setup (FastAPI + MySQL)

#### 🔹 Create and activate Python virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 🔹 Install dependencies and run backend:
```bash
cd backend
pip install -r requirements.txt

# Copy example.env to .env and configure it
cp example.env .env  # macOS/Linux
# OR
copy example.env .env  # Windows (Command Prompt)

py ./run.py
```

### 3. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

> ✅ Make sure to configure the `.env` files for database and API keys in both `/backend` and `/frontend`.

---

## 🧪 Testing

- API Load Testing: JMeter test plans included (`/tests/jmeter`)
- E2E UI Testing: Cypress tests (`/frontend/cypress`)
- Unit Testing: FastAPI routes tested with `unittest` in `/backend/tests`

---

## 🗂️ Documentation

- **📘 Wiki:** [Visit Project Wiki](https://github.com/Phantawat/BreatheEasy/wiki)
- **📑 API Docs:** Swagger/OpenAPI available at:  
  `http://localhost:8000/docs`
- **🧠 ML Models:** Documentation for prediction models is in the [ML Guide](https://github.com/Phantawat/BreatheEasy/wiki/Prediction-Model)

---

## 🧰 Tech Stack

| Layer         | Technology                    |
|---------------|-------------------------------|
| Frontend      | React + Vite + Tailwind CSS   |
| Backend       | FastAPI                       |
| Sensors       | PMS7003, KY-015 (ESP32/KidBright) |
| Data Pipeline | MySQL + Node-RED + Python     |
| ML Models     | XGBoost + Pandas + Scikit-learn |
| Visualization | Recharts                      |
| Testing       | JMeter, Cypress, unittest     |

---

## ✍️ Author

*Phantawat Lueangsiriwattana*  
*Thanawat Tantijaroensin*

GitHub: [@Phantawat](https://github.com/Phantawat) [@tarothanawat](https://github.com/tarothanawat)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
