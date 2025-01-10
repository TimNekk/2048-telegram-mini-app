<div align="center">
  <h1>🎮 2048 Telegram Mini App</h1>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
  [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
  [![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://telegram.org/)
</div>

## 🌟 Overview

A modern implementation of the classic 2048 game as a Telegram Mini App, featuring a Telegram bot for game interactions and user engagement. This project combines the addictive gameplay of 2048 with seamless Telegram integration and a sleek, responsive design optimized for the Telegram platform.

## 🏗️ Project Structure

The project consists of three main components:

### 🎨 Web Frontend (`/web`)
- Telegram Mini App built with React 18 and TypeScript
- Telegram UI components for native look and feel
- Telegram Apps SDK for platform integration
- SWR for data fetching
- Vite as build tool
- Full responsive design optimized for Telegram
- Deployment ready for Telegram Mini App hosting

### 🔧 API (`/api`)
- Written in Go
- Clean architecture with internal/pkg structure
- Docker containerization
- Environment configuration support
- Makefile for common operations
- Air for live reload during development
- Configured for Dokploy deployment

### 🤖 Bot (`/bot`)
- Telegram Bot implementation in Python
- UV package manager for dependencies
- Containerized with Docker
- Modular source structure in src/
- Handles user interactions and game management through Telegram
- Integrated with Telegram Bot API

## ✨ Features

- 🎯 Classic 2048 gameplay optimized for Telegram
- 🤖 Telegram Bot for game management and user interaction
- 📊 Score tracking and statistics through Telegram
- 🎮 Smooth animations and responsive design
- 🌐 API for game state management
- 🐳 Docker support with Dokploy configuration
- 📱 Native Telegram UI integration

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Go 1.21+
- Python 3.8+
- Docker and Docker Compose
- Make (for API development)
- Telegram account for testing

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/2048.git
cd 2048
```

2. Start the web application:
```bash
cd web
npm install
npm run dev
```

3. Start the API server:
```bash
cd api
make run
# Or with Docker:
docker-compose up api
```

4. Run the bot (optional):
```bash
cd bot
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m src
```

### 🐳 Deployment

The project is configured for deployment using Dokploy:

```bash
# Deploy the entire stack
dokploy up

# Deploy specific services
dokploy up api
dokploy up bot
dokploy up web
```

Environment configuration is managed through Dokploy for each component.

## 🎮 How to Play

1. Use arrow keys or swipe gestures to move tiles
2. Combine matching numbers to create larger values
3. Win promocodes

## 🤖 Bot Features

- Implements advanced game-playing strategies
- Can be used to analyze game states
- Provides move suggestions
- Demonstrates optimal playing techniques

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🌟 Acknowledgments

- Original 2048 game by Gabriele Cirulli
- React and TypeScript communities
- Telegram community
- All contributors and players!
