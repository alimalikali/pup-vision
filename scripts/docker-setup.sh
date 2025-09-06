#!/bin/bash

# ===========================================
# Docker Setup Script for Pup Marriage SaaS
# ===========================================

set -e

echo "🐳 Setting up Pup Marriage SaaS with Docker..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    print_warning ".env.local not found. Creating from .env.example..."
    cp .env.example .env.local
    print_success "Created .env.local from .env.example"
    print_warning "Please update .env.local with your actual values before continuing."
fi

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    docker-compose exec app npx prisma migrate deploy
    print_success "Database migrations completed"
}

# Function to generate Prisma client
generate_prisma_client() {
    print_status "Generating Prisma client..."
    docker-compose exec app npx prisma generate
    print_success "Prisma client generated"
}

# Function to seed database
seed_database() {
    print_status "Seeding database..."
    docker-compose exec app npm run db:seed
    print_success "Database seeded successfully"
}

# Function to show logs
show_logs() {
    print_status "Showing application logs..."
    docker-compose logs -f app
}

# Main setup function
setup_development() {
    print_status "Setting up development environment..."
    
    # Start services
    print_status "Starting Docker services..."
    docker-compose -f docker-compose.dev.yml up -d
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Run migrations
    run_migrations
    
    # Generate Prisma client
    generate_prisma_client
    
    # Seed database
    seed_database
    
    print_success "Development environment is ready!"
    print_status "Application is running at: http://localhost:3000"
    print_status "Database is running at: localhost:5432"
}

# Main setup function for production
setup_production() {
    print_status "Setting up production environment..."
    
    # Start services
    print_status "Starting Docker services..."
    docker-compose up -d
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 15
    
    # Run migrations
    run_migrations
    
    # Generate Prisma client
    generate_prisma_client
    
    print_success "Production environment is ready!"
    print_status "Application is running at: http://localhost:3000"
}

# Function to stop services
stop_services() {
    print_status "Stopping Docker services..."
    docker-compose down
    print_success "Services stopped"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down -v
    docker system prune -f
    print_success "Cleanup completed"
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Setup development environment"
    echo "  prod        Setup production environment"
    echo "  migrate     Run database migrations"
    echo "  seed        Seed the database"
    echo "  logs        Show application logs"
    echo "  stop        Stop all services"
    echo "  cleanup     Stop services and clean up resources"
    echo "  help        Show this help message"
    echo ""
}

# Parse command line arguments
case "${1:-dev}" in
    "dev")
        setup_development
        ;;
    "prod")
        setup_production
        ;;
    "migrate")
        run_migrations
        ;;
    "seed")
        seed_database
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        stop_services
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
