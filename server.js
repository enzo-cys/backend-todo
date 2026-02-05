import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from './routes/auth.js';
import todosRoutes from './routes/todos.js';

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;


// MIDDLEWARES
// CORS : autorise les requêtes depuis d'autres domaines (React sur le port 3000)
app.use(cors());

// Parser le JSON des requêtes
app.use(express.json());

// Route racine - Message de bienvenue
app.get('/', (req, res) => {
    res.json({ 
        message: "Bienvenue sur l'API TodoList",
        version: "2.0.0",
        endpoints: {
            auth: "/api/auth (POST /register, POST /login)",
            todos: "/api/todos (GET, POST, PUT/:id, DELETE/:id) - Protégé par JWT"
        }
    });
});

// Routes d'authentification (register, login)
app.use('/api/auth', authRoutes);

// Routes des todos (CRUD) - Protégées par JWT
app.use('/api/todos', todosRoutes);

// GESTION D'ERREURS 404
app.use((req, res) => {
    res.status(404).json({ 
        message: "Route non trouvée" 
    });
});


// DÉMARRAGE DU SERVEUR
app.listen(PORT, () => {
    console.log(`Serveur démarré sur : http://localhost:${PORT}`);
});