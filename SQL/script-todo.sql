CREATE DATABASE IF NOT EXISTS todolist_db charset utf8mb4 collate utf8mb4_general_ci;
USE todolist_db;

CREATE USER 'todo-admin'@'localhost' IDENTIFIED BY 'todo-password';

GRANT ALL PRIVILEGES
ON `todolist_db`.*
TO 'todo-admin'@'localhost';

FLUSH PRIVILEGES;

-- ═══════════════════════════════════════════════════════════════
--                    SCHEMA BASE DE DONNÉES
--                TODOLIST (Version avec Auth JWT)
-- ═══════════════════════════════════════════════════════════════
--
-- Version AVEC authentification
-- Chaque todo est lié à un utilisateur
--
-- ═══════════════════════════════════════════════════════════════

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS todolist_db;
USE todolist_db;

-- ═══════════════════════════════════════════════════════════════
-- TABLE USERS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════
-- TABLE TODOS (avec user_id)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ═══════════════════════════════════════════════════════════════
-- INDEX pour optimiser les requêtes
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_users_email ON users(email);