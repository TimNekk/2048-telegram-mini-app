package migrations

import (
	"database/sql"
	"log"
)

// RunMigrations executes all database migrations in order
func RunMigrations(db *sql.DB) error {
	log.Println("Running database migrations...")

	// Execute each migration in a transaction
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Create users table first
	log.Println("Creating users table...")
	if _, err := tx.Exec(createUsersTable); err != nil {
		return err
	}

	// Then create games table with foreign key
	log.Println("Creating games table...")
	if _, err := tx.Exec(createGamesTable); err != nil {
		return err
	}

	// Create promocode tables
	log.Println("Creating promocode tables...")
	if _, err := tx.Exec(createPromocodeTables); err != nil {
		return err
	}

	// Add nickname column to users table
	log.Println("Adding nickname column to users table...")
	if _, err := tx.Exec(addNicknameToUsersTable); err != nil {
		return err
	}

	// Make nickname column required
	log.Println("Making nickname column required...")
	if _, err := tx.Exec(makeNicknameRequired); err != nil {
		return err
	}

	// Add updated_at column to games table
	log.Println("Adding updated_at column to games table...")
	if _, err := tx.Exec(addUpdatedAtToGamesTable); err != nil {
		return err
	}

	// Commit the transaction
	if err := tx.Commit(); err != nil {
		return err
	}

	log.Println("Database migrations completed successfully")
	return nil
}

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
`

const createGamesTable = `
CREATE TABLE IF NOT EXISTS games (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT valid_status CHECK (status IN ('in_progress', 'finished', 'skipped'))
);
`

const createPromocodeTables = `
CREATE TABLE IF NOT EXISTS promocode_types (
    id SERIAL PRIMARY KEY,
    discount DECIMAL NOT NULL,
    min_order DECIMAL NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    type VARCHAR(10) NOT NULL CHECK (type IN ('record', 'total')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promocodes (
    id BIGSERIAL PRIMARY KEY,
    promocode_type_id INTEGER NOT NULL REFERENCES promocode_types(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    code VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (promocode_type_id, user_id)
);
`

const addNicknameToUsersTable = `
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname TEXT;
`

const makeNicknameRequired = `
ALTER TABLE users ALTER COLUMN nickname SET NOT NULL;
`

const addUpdatedAtToGamesTable = `
ALTER TABLE games ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_games_updated_at ON games;
CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`
