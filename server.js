import express from 'express';
import cors from 'cors';
import "dotenv/config";

const app = express();

app.get('/' , (req , res) => {

    res.json({ response: "Bienvenue sur le backend ToDo"})
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur : http://localhost:${PORT}`);
});