import express from 'express';
import cors from 'cors';
import "dotenv/config";
// Get the client
import mysql from 'mysql2/promise';

const app = express();

// Create the connection to database
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'todo-admin',
  password: 'todo-password',
  database: 'todolist_db',
});

app.get('/' , (req , res) => {

    res.json({ response: "Bienvenue sur le backend ToDo"})
});

app.get('/api/todos', async (req , res) => {
// A simple SELECT query
try {
  const [results, fields] = await connection.query(
    'SELECT * FROM todos'
  );

  console.log(results); // results contains rows returned by server
  console.log(fields); // fields contains extra meta data about results, if available

    res.json({ results: results }); // reponse au navigateur
} catch (err) {
  console.log(err);
}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur : http://localhost:${PORT}`);
});