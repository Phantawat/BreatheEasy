# backend/run.py
import uvicorn

if __name__ == "__main__":
    uvicorn.run("swagger_server.app:app", host="0.0.0.0", port=8000, reload=True)