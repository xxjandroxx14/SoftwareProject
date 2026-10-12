const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware to handle CORS and JSON request bodies
app.use(cors());
app.use(express.json());

// Serve static web files (index.html, style.css, script.js)
app.use(express.static(__dirname));

// Database connection configuration
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'alay_kapwa_db',
  port: 3306
});

// Connect to MySQL Workbench Database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL Workbench Database!');
});

// Login API Route (MySQL Integration)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ success: false, message: 'Database query error' });
    }

    if (results.length > 0) {
      res.json({ 
        success: true, 
        message: 'Login successful!', 
        user: results[0].username 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }
  });
});

// Start the Express Server (Listening on 0.0.0.0 for LAN access)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running locally at http://localhost:${PORT}`);
  console.log(`Server accessible on network at http://<YOUR_LOCAL_IP>:${PORT}`);
});