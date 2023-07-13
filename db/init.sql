SELECT 'CREATE DATABASE nest_ecommerce'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE pg_database.datname = 'nest_ecommerce');