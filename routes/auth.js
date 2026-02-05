import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import 'dotenv/config';

const router = express.Router();

// POST /api/auth/register
// Créer un nouveau compte utilisateur
// Body attendu : { email, password }
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validation des champs
        if (!email || !password || !name) {
            return res.status(400).json({ 
                message: 'Email, mot de passe et nom requis' 
            });
        }

        // Validation de l'email (regex simple)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Format d\'email invalide' 
            });
        }

        // Validation du mot de passe (minimum 6 caractères)
        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Le mot de passe doit contenir au moins 6 caractères' 
            });
        }

        // Validation du nom (minimum 2 caractères)
        if (name.length < 2) {
            return res.status(400).json({ 
                message: 'Le nom doit contenir au moins 2 caractères' 
            });
        }

        // Vérifier si l'email existe déjà
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ 
                message: 'Cet email est déjà utilisé' 
            });
        }

        // Hasher le mot de passe avec bcrypt (10 = nombre de rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer le nouvel utilisateur dans la base de données
        const [result] = await db.query(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            [email, hashedPassword, name]
        );

        // Retourner une réponse de succès
        res.status(201).json({ 
            message: 'Utilisateur créé avec succès',
            user: { 
                id: result.insertId, 
                email,
                name
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

// POST /api/auth/login
// Se connecter et recevoir un token JWT
// Body attendu : { email, password }
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation des champs
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email et mot de passe requis' 
            });
        }

        // Chercher l'utilisateur par email
        const [users] = await db.query(
            'SELECT id, email, password, name FROM users WHERE email = ?',
            [email]
        );

        // Si l'utilisateur n'existe pas
        if (users.length === 0) {
            return res.status(401).json({ 
                message: 'Email ou mot de passe incorrect' 
            });
        }

        const user = users[0];

        // Comparer le mot de passe fourni avec le hash stocké
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Email ou mot de passe incorrect' 
            });
        }

        // Créer un token JWT
        // Le payload contient les informations de l'utilisateur (SANS le mot de passe)
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Le token expire après 24 heures
        );

        // Retourner le token au client
        res.json({ 
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
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

export default router;
