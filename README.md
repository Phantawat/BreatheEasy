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

---

### 2. Backend Setup (FastAPI + MySQL)

#### 🔹 Create and activate Python virtual environment:

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

---

> ⚠️ **TensorFlow Compatibility Notice:**  
> TensorFlow is **not yet compatible with Python 3.13**.  
> If you encounter an error installing `tensorflow` from `requirements.txt`, please switch to **Python 3.12.7**.
>
> Download Python 3.12.7: https://www.python.org/downloads/release/python-3127/

---

#### 🔹 Install dependencies and run backend:

```bash
cd backend
pip install -r requirements.txt
```

Then copy the environment file:

**Windows:**
```bash
copy example.env .env
```

**macOS / Linux:**
```bash
cp example.env .env
```

Finally, run the FastAPI server:

```bash
python run.py
```

---

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

> ✅ Be sure to configure `.env` files in both `backend/` and `frontend/` directories with your database connection and API keys.

---

## 🧪 Testing

- API Load Testing: JMeter 
- Unit Testing: FastAPI routes tested with `unittest` in `/backend/tests`
- UI Testing: `/frontend/tests`

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
| Frontend      | React    |
| Backend       | FastAPI                       |
| Sensors       | PMS7003, KY-015 (ESP32/KidBright) |
| Data Pipeline | MySQL + Node-RED + Python     |
| ML Models     | XGBoost + Pandas + Scikit-learn |
| Visualization | Recharts                      |
| Testing       | JMeter, Selenium, unittest     |

---

## ✍️ Author

*Phantawat Lueangsiriwattana*  
*Thanawat Tantijaroensin*

GitHub: [@Phantawat](https://github.com/Phantawat) [@tarothanawat](https://github.com/tarothanawat)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

