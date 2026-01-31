const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3020;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Connect to mydb
mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log("Database connected successfully to mydb");
});

// Schema & Model - using the same field names as the form
const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    phone: String,
    message: String
});

// Create model for the "datas" collection
const Users = mongoose.model("datas", userSchema);

// Serve different pages with different routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/skills', (req, res) => {
    res.sendFile(path.join(__dirname, 'skills.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'projects.html'));
});

app.get('/certificates', (req, res) => {
    res.sendFile(path.join(__dirname, 'certificates.html'));
});

// Handle form submission
app.post('/post', async (req, res) => {
    try {
        console.log("Received form data:", req.body);
        
        const user = new Users({
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message
        });
        
        await user.save();
        console.log("User saved to database:", user);
        
        // Send a success response
        res.send("Your form has been submitted successfully.");
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send("Error saving your data. Please try again.");
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});