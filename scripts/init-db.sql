-- ===========================================
-- Database Initialization Script for Pup Marriage SaaS
-- ===========================================

-- Create database if it doesn't exist (PostgreSQL will handle this)
-- The database is already created via POSTGRES_DB environment variable

-- Set timezone
SET timezone = 'UTC';

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance (these will be created by Prisma migrations)
-- But we can add some additional indexes here if needed

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE pup_marriage TO postgres;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully for Pup Marriage SaaS';
END $$;
