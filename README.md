## ✅ Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** `>= 22.0.0` [Download Node.js](https://nodejs.org/en/download) or **NVM**
- **Yarn** (`npm install -g yarn`)
- **Docker**  
  [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**  
  [Install Docker Compose](https://docs.docker.com/compose/install/)

---

## 📦 Install the dependencies

```bash
corepack enable
yarn install
```

## 🛠️ Getting Started

1. **Copy the environment file:**

```bash
cp .env.dev.example .env
```

2. **Start the services:**

```bash
docker compose up
```

3. **Open your browser and visit http://localhost:3000** (the port set in the .env file).

---

## 🤝 Contributing

Check out the Contributing Guide for more information.
