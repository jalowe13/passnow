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
docker ps -a # List running containers (so you can grab your container-id)
# start and stop container
docker start (dockerid)
docker stop (dockerid)


# Install packages for the client and run
npm install
npm install --save-dev electron

# Install packages for the server and run
```bash
cd src/backend # Navigate to the backend server
python3 -m venv venv # Create a virtualenv
source venv/bin/activate # Activate the virtualenv
pip install -r requirements.txt # Install all package requirements
```
# If some packages needed to be deleted
```bash
rm package-lock.json
rm -rf node_modules
```

# To Run
```bash
npm run start-uvicorn # For the server side
npm run electron-start # For the client side

```

### Alternate Backend with Install Notes
FastAPI, (ASGI to serve ) Postgres, and Python


### Mobile Implementation

React Native


