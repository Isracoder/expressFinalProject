#!/bin/sh
set -e

# This file is for setting up everything necessary on the aws instance

sudo apt update
sudo apt upgrade -y

sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings

# install docker
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
# Add the repository to Apt sources:
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# create github user
sudo mkdir -p /home/app
sudo useradd --no-create-home --home-dir /home/app --shell /bin/bash github
sudo usermod --append --groups docker github
sudo usermod --append --groups docker ubuntu
sudo chown github:github -R /home/app

github_pubkey='ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPyu4NHn4sv4cG0JcygjGj39rXTUb3snB/ZvpImciG/r IZughyer@gmail.com'

sudo -u github sh -c "mkdir -p /home/app/.ssh && echo $github_pubkey > /home/app/.ssh/authorized_keys"


# Pull the Docker Compose file from your GitHub repository
wget https://raw.githubusercontent.com/Isracoder/expressFinalProject/docker-compose-prod.yml

docker login ghcr.io -u Isracoder -p "my personal access code"

# Set environment variables
export DB_PASSWORD="db-password"
export DB_HOST="your-database-host"
export DB_USERNAME="your-database-username"
export DB_NAME="your-database-name"

# Run the Docker Compose with the specific environment variables
docker compose -f docker-compose-prod.yml -p expressfinalproject up -d
