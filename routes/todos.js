import express from 'express';
import db from '../config/database.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes ci-dessous sont protégées par le middleware d'authentification
router.use(authMiddleware);

// GET /api/todos
// Récupérer tous les todos de l'utilisateur connecté
router.get('/', async (req, res) => {
    try {
        // req.user.userId est disponible grâce au middleware authMiddleware
        const userId = req.user.userId;

        const [todos] = await db.query(
            'SELECT id, text, completed, created_at, updated_at FROM todos WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        res.json({ 
            message: 'Liste des tâches',
            data: todos 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            message: 'Erreur serveur', 
            error: err.message 
        });
    }
});

// POST /api/todos
// Créer un nouveau todo pour l'utilisateur connecté
// Body attendu : { text, completed }
router.post('/', async (req, res) => {
    try {
        const { text, completed } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!text) {
            return res.status(400).json({ 
                message: 'Le champ "text" est requis' 
            });
        }

        // Insérer le todo avec l'ID de l'utilisateur
        const [result] = await db.query(
            'INSERT INTO todos (text, completed, user_id) VALUES (?, ?, ?)',
            [text, completed || false, userId]
        );

        res.status(201).json({
            message: 'Tâche créée avec succès',
            data: {
                id: result.insertId,
                text,
                completed: completed || false,
                user_id: userId
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            message: 'Erreur serveur', 
            error: err.message 
        });
    }
});

// PUT /api/todos/:id
// Modifier un todo existant (seulement si il appartient à l'utilisateur)
// Body attendu : { text, completed }
router.put('/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        const { text, completed } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!text) {
            return res.status(400).json({ 
                message: 'Le champ "text" est requis' 
            });
        }

        if (completed === undefined) {
            return res.status(400).json({ 
                message: 'Le champ "completed" est requis' 
            });
        }

        // Mettre à jour le todo SEULEMENT si il appartient à l'utilisateur connecté
        const [result] = await db.query(
            'UPDATE todos SET text = ?, completed = ? WHERE id = ? AND user_id = ?',
            [text, completed, todoId, userId]
        );

        // Si aucune ligne n'a été modifiée, le todo n'existe pas ou n'appartient pas à l'utilisateur
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                message: 'Tâche non trouvée ou non autorisée' 
            });
        }

        res.json({
            message: 'Tâche mise à jour avec succès',
            data: {
                id: todoId,
                text,
                completed
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            message: 'Erreur serveur', 
            error: err.message 
        });
    }
});

// DELETE /api/todos/:id
// Supprimer un todo (seulement si il appartient à l'utilisateur)
router.delete('/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        const userId = req.user.userId;

        // Supprimer le todo SEULEMENT si il appartient à l'utilisateur connecté
        const [result] = await db.query(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [todoId, userId]
        );

        // Si aucune ligne n'a été supprimée, le todo n'existe pas ou n'appartient pas à l'utilisateur
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                message: 'Tâche non trouvée ou non autorisée' 
            });
        }

        res.json({ 
            message: 'Tâche supprimée avec succès' 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            message: 'Erreur serveur', 
            error: err.message 
        });
    }
});

export default router;
