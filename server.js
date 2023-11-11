const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database('userdata.db');

// Benutzertabelle erstellen, falls sie noch nicht existiert
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT)');
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Registrierungsendpunkt
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Benutzer zur Datenbank hinzufügen
    const stmt = db.prepare('INSERT INTO users VALUES (?, ?)');
    stmt.run(username, password, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.json({ message: 'Registration successful' });
        }
    });
    stmt.finalize();
});

// Anmeldeendpunkt
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Benutzer aus der Datenbank abrufen
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Internal Server Error' });
        } else if (row) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// Zusätzliche Endpunkte aus server2.js
const users = [];

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

    if (user && user.password === password) {
        res.json({ message: 'Erfolgreich angemeldet.' });
    } else {
        res.status(401).json({ message: 'Falscher Benutzername oder Passwort.' });
    }
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (users.some(u => u.username === username)) {
        res.status(400).json({ message: 'Benutzername bereits vergeben.' });
    } else {
        users.push({ username, password });
        res.json({ message: 'Registrierung erfolgreich.' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
