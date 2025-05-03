# Password Manager Application

## Front-End

React
ANT UED

### Back-End

Electron for Framework

# TODO Linux migration under way
# Instruction and setup on Linux

# Setting up docker with the pacman package manager (for others look into apt and dnf)
```bash
sudo pacman -Syu docker docker-compose # Install
sudo systemctl start docker.service # Start docker daemon service
sudo systemctl enable docker.service # Enable docker to start on boot
```

# Install and run the PostgreSQL Container (replace with your own password)
```bash
docker run --name my-postgres-db \
  -e POSTGRES_PASSWORD=insertthepasswordhere\
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  -d \
  postgres
```
# To run later you can use the following commands
```bash
docker psa -a # List running containers (so you can grab your container-id)
# start and stop container
docker start (dockerid)
docker stop (dockerid)
```



### Alternate Backend with Install Notes
FastAPI, (ASGI to serve ) Postgres, and Python

```bash
# Setup
# Containerize Python instance
pip install virtualenv
pip install psycopg2-binary
pip install pandas
virtualenv venv
source venv/bin/activate
pip install fastapi
pip install uvicorn

# Running in GO
npm run startappgo
# Running in Python (Experimental)
npm run startapp
npm run start-uvicorn
```

### Mobile Implementation

React Native

### Build and Run

To run

> npm run startappnode
