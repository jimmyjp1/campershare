#!/bin/bash

# CamperShare Docker Development Setup Script

echo "🚀 Starting CamperShare Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Create necessary directories
mkdir -p database/init
mkdir -p uploads/campers
mkdir -p logs

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Copy environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "📝 Created .env.local file. Please update with your API keys."
fi

# Build and start containers
echo "🐳 Building and starting Docker containers..."
docker-compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to initialize..."
sleep 15

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ All containers are running successfully!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - PgAdmin:  http://localhost:8080"
    echo "   - Database: localhost:5432"
    echo "   - Redis:    localhost:6379"
    echo ""
    echo "📊 PgAdmin Login:"
    echo "   - Email: admin@campershare.com"
    echo "   - Password: admin123"
    echo ""
    echo "🔧 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
else
    echo "❌ Some containers failed to start. Check logs with: docker-compose logs"
    exit 1
fi
