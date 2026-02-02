CREATE DATABASE IF NOT EXISTS todolist_db charset utf8mb4 collate utf8mb4_general_ci;
USE todolist_db;

CREATE USER 'todo-admin'@'localhost' IDENTIFIED BY 'todo-password';

GRANT ALL PRIVILEGES
ON `todolist_db`.*
TO 'todo-admin'@'localhost';

FLUSH PRIVILEGES;

-- ═══════════════════════════════════════════════════════════════
--                    SCHEMA BASE DE DONNÉES
--                   TODOLIST 
-- ═══════════════════════════════════════════════════════════════

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS todolist_db;
USE todolist_db;

-- ═══════════════════════════════════════════════════════════════
-- TABLE TODOS (sans user_id)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════
-- DONNÉES DE TEST
-- ═══════════════════════════════════════════════════════════════

INSERT INTO todos (text, completed) VALUES
    ('Apprendre Express.js', FALSE),
    ('Configurer MySQL', TRUE),
    ('Créer les routes CRUD', FALSE),
    ('Tester avec Postman', FALSE);