// Importation des dépendances
import express from "express";
import cors from "cors";
import "dotenv/config";
import mysql from 'mysql2/promise';

// Initialisation de l'application Express
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à la base de données MySQL
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'todo-admin',
    password: 'todo-password',
    database: 'todolist_db',
});

// Route racine - Message de bienvenue
app.get('/', (req, res) => {
    res.json({ message: "Bienvenue sur l'API ToDo" });
});

// GET /api/todos - Récupère toutes les tâches
app.get('/api/todos', async (req, res) => {
    try {
        const [results] = await connection.query('SELECT * FROM todos');

        res.json({ message: "Liste des tâches", data: results });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

// POST /api/todos - Ajoute une nouvelle tâche
app.post('/api/todos', async (req, res) => {
    try {
        const sql = 'INSERT INTO `todos`(`text`, `completed`) VALUES (?, ?)';

        // Validation des paramètres
        if (!req.body.text) {
            return res.status(400).json({ message: "Le champ 'text' est requis" });
        }

        if (!req.body.completed) {
            return res.status(400).json({ message: "Le champ 'completed' est requis" });
        }

        const values = [req.body.text, req.body.completed || false];

        const [result] = await connection.execute(sql, values);

        res.status(201).json({
            message: "Tâche créée avec succès",
            data: { id: result.insertId, text: req.body.text, completed: req.body.completed || false }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

// TODO: Exercice 1 - Implémenter PUT /api/todos/:id
// Modifier une tâche existante (text et/ou completed)
// Utiliser req.params.id pour récupérer l'ID
// SQL: UPDATE todos SET text = ?, completed = ? WHERE id = ?

// TODO: Exercice 2 - Implémenter DELETE /api/todos/:id
// Supprimer une tâche par son ID
// Utiliser req.params.id pour récupérer l'ID
// SQL: DELETE FROM todos WHERE id = ?

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur : http://localhost:${PORT}`);
});