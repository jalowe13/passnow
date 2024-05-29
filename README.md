# Password Manager Application

## Front-End

React
ANT UED

### Back-End

Electron for Framework

### Alternate Backend with Install Notes

FastAPI, (ASGI to serve ) DynamoDB, and Python

```bash
# Setup
pip install fastapi
pip install uvicorn
docker pull amazon/dynamodb-local

# Running
python -m uvicorn server:app --reload
docker run -p 8000:8000 amazon/dynamodb-local
```

### Mobile Implementation

React Native

### Build and Run

To run

> npm run startappnode
