const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Only one declaration needed

// Setup express-session
app.use(session({
    secret: '8cbe84c1a25a5ad53ab5917c61bbd09ab34e114145a971d80be05c76a660056d138bac75ea8a24d7df0ac675f50c9b2691814d6dc97560ae76eae2b3c08f3ee7', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,      // Use environment variables
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Routes for HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Other routes remain the same...
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'contact.html'));
});

// Signup route
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const sqlCheck = 'SELECT * FROM users WHERE email = ?';
    db.query(sqlCheck, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).json({ message: 'Error hashing password', error: err });
            }

            // Insert the new user into the database
            const sqlInsert = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(sqlInsert, [username, email, hash], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error creating user', error: err });
                }
                
                // Redirect to the login page after successful signup
                res.redirect('/login.html');
            });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sqlCheck = 'SELECT * FROM users WHERE email = ?';
    db.query(sqlCheck, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords', error: err });
            }
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            // Store user info in the session
            req.session.user = { 
                id: user.id, 
                email: user.email, 
                username: user.username, 
                createdAt: user.created_at
            };
            res.redirect('/index.html');
        });
    });
});

// Check login status API
app.get('/api/check-login', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.redirect('/login.html');
    });
});


app.get('/api/user-details', (req, res) => {
    if (req.session.user) {
        // Send back user details
        res.json({
            loggedIn: true,
            user: {
                username: req.session.user.username,
                email: req.session.user.email,
                memberSince: req.session.user.createdAt, // Assuming you have createdAt in session
            }
        });
    } else {
        res.json({ loggedIn: false });
    }
});


// Route to handle student_enrollment form submission
app.post('/enroll', (req, res) => {
    const { full_name, dob, gender, email, phone, address_location, county, city, selected_course } = req.body;

    // Check if all required fields are present
    if (!full_name || !dob || !gender || !email || !phone || !address_location || !county || !city || !selected_course) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const sql = "INSERT INTO student_enrollment (full_name, dob, gender, email, phone, address_location, county, city, selected_course) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [full_name, dob, gender, email, phone, address_location, county, city, selected_course], (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            return res.status(500).json({ success: false, message: 'Error enrolling student. Please try again.' });
        }
        res.json({ success: true, message: 'Enrollment successful' });
    });
});


// Handle POST request for form submission
app.post('/submit-contact-form', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate the input data (you can add more robust validation here)
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert the form data into the MySQL table
    const query = 'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, subject, message], (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        res.status(200).json({ success: 'Message sent successfully!' });
    });
});


const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});