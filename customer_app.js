// Importing necessary libraries and modules
const mongoose = require('mongoose');            // MongoDB ODM library
const Customers = require('./customer');         // Imported MongoDB model for 'customers'
const express = require('express');              // Express.js web framework
const session = require('express-session');      // Middleware for managing user sessions
const bodyParser = require('body-parser');       // Middleware for parsing JSON requests
const path = require('path');                    // Node.js path module for working with file and directory paths
const dotenv = require('dotenv');                // Module for loading environment variables from a .env file
// Importing the 'bcrypt' library for hashing passwords.
const bcrypt = require('bcrypt');
// Defining the number of salt rounds for bcrypt hashing. This determines the complexity of the hashing process.
const saltRounds = 5;

// Defining a constant password for demonstration purposes. In a real application, passwords should be securely hashed and stored.
const password = "admin";              

dotenv.config();

// Creating an instance of the Express application
const app = express();

app.use(session({
    cookie: { maxAge: 120000 }, // Session expires after 2 minutes of inactivity
    secret: 'itsmysecret', // Secret key for signing the session ID cookie
    res: false, // Forces the session to be saved back to the session store, even if it was never modified during the request
    saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified
    genid: () => uuid.v4() // Generates a unique session ID using the uuid library
}));

// Setting the port number for the server
const port = 3000;

// MongoDB connection URI and database name
const uri =  process.env.MONGODB_URI;
mongoose.connect(uri, {'dbName': 'customerDB'});

// Middleware to parse JSON requests
app.use("*", bodyParser.json());

// Serving static files from the 'frontend' directory under the '/static' route
app.use('/static', express.static(path.join(".", 'frontend')));

// Middleware to handle URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// POST endpoint for user login
app.post('/api/login', async (req, res) => {
    const data = req.body;
    console.log(data);
    let user_name = data['user_name'];
    let password = data['password'];

    // Querying the MongoDB 'customers' collection for matching user_name and password
    const documents = await Customers.find({ user_name: user_name, password: password });

    // If a matching user is found, set the session username and serve the home page
    if (documents.length > 0) {
        let result = await bcrypt.compare(password, documents[0]['password']);
        if(true) {
            const genidValue = req.sessionID; // Storing the session ID in a variable for potential use
            req.session.username = user_name; // Storing the username in the session for later use
            res.cookie('username', user_name); // Setting a cookie with the username for client-side access
            res.sendFile(path.join(__dirname, 'frontend', 'home.html')); // Serving the home page to the client
        } else {
            res.send("Password Incorrect! Try again");
        } 
    } else {
        res.send("User Information incorrect");
    }
});

// POST endpoint for adding a new customer
app.post('/api/add_customer', async (req, res) => {
    const data = req.body;
    console.log(data)
    const documents = await Customers.find({ user_name: data['user_name']});
    if (documents.length > 0) {
        res.send("User already exists");
    }

    // Hashing the password using bcrypt before saving it to the database
    let hashedpwd = bcrypt.hashSync(data['password'], saltRounds);
    
    // Creating a new instance of the Customers model with data from the request
    const customer = new Customers({
        "user_name": data['user_name'],
        "age": data['age'],
        "password": hashedpwd,
        "email": data['email']
    });

    // Saving the new customer to the MongoDB 'customers' collection
    await customer.save();

    res.send("Customer added successfully")
});

// GET endpoint for the root URL, serving the home page
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
});

// Starting the server and listening on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
