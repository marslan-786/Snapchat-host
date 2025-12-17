# Base Image
FROM node:18-alpine

# Install OpenSSH and packages
RUN apk add --no-cache openssh bash

# SSH Key Generate karen (Zaroori hai server start hone ke liye)
RUN ssh-keygen -A

# SSH Configuration settings
RUN echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config
RUN echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config
RUN echo 'ListenAddress 0.0.0.0' >> /etc/ssh/sshd_config

# Work Directory set karen
WORKDIR /app

# Files copy karen
COPY package.json .
COPY server.js .

# Node modules install karen
RUN npm install

# ----------------------------------------------------
# USERNAME AUR PASSWORD YAHAN SET KAREN
# Filhal User: root | Pass: 12345 hai. Ise change kar len.
# ----------------------------------------------------
RUN echo 'root:786786' | chpasswd

# Container start hone par SSH aur Node server dono chalayen
CMD ["/bin/sh", "-c", "/usr/sbin/sshd && node server.js"]
