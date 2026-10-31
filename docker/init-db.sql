-- Create test database if it does not already exist
SELECT 'CREATE DATABASE uni_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'uni_test')\gexec

