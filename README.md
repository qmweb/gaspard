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

## ✨ Creating a New Feature

To generate a new feature (optionally with a page and styles), run:

```bash
yarn next-maker feature:create
```

You will be prompted for the feature name, and whether to create a page for it. If you choose to create a page, you will also select the section (front, middle, or back). The script will generate the necessary files and folders in the appropriate locations.

---

## 🤝 Contributing

Check out the Contributing Guide for more information.
