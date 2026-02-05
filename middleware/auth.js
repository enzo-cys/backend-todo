import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * Middleware d'authentification
 * Vérifie le token JWT dans le header Authorization
 * Format attendu : "Bearer <token>"
 */
const authMiddleware = (req, res, next) => {
    // Récupérer le header Authorization
    const authHeader = req.headers.authorization;
    
    // Extraire le token du format "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    // Si pas de token, retourner une erreur 401 (Unauthorized)
    if (!token) {
        return res.status(401).json({ 
            message: 'Token manquant. Vous devez être connecté.' 
        });
    }

    try {
        // Vérifier et décoder le token avec la clé secrète
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ajouter les informations de l'utilisateur à la requête
        // Ces infos seront disponibles dans toutes les routes protégées
        req.user = decoded;
        
        // Passer au middleware/route suivant
        next();
    } catch (err) {
        // Si le token est invalide ou expiré
        return res.status(403).json({ 
            message: 'Token invalide ou expiré. Veuillez vous reconnecter.' 
        });
    }
};

export default authMiddleware;
