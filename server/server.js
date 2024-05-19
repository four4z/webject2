const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;
const upload = multer();
const secret = 'test'; // For production, use a secure environment variable

let db;
let client;

// Middleware to parse JSON and URL-encoded data and handle cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: ['http://localhost:5500'] }));

async function connectDB() {
    try {
        client = new MongoClient('mongodb+srv://webject2:SbtDTeIU9pIIs8b3@loginweb2.wtpq5wl.mongodb.net/', { useUnifiedTopology: true });
        await client.connect();
        db = client.db('webject');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

// Connect to the database
connectDB();

// Middleware to ensure MongoDB connection is established
app.use(async (req, res, next) => {
    if (!client || !client.topology || !client.topology.isConnected()) {
        console.log("Reconnecting to MongoDB...");
        await connectDB();
    }
    next();
});

// Hash password function
const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password', error);
    }
};

// Match password function
const matchPassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Error matching password', error);
    }
};

// Sign Up
app.post('/api/signup', upload.none(), async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const findEmail = await db.collection('users').findOne({ email });
        if (findEmail) {
            return res.status(409).json({ error: 'Email already used!' });
        }

        const hashedPassword = await hashPassword(password);
        const createUser = {
            email,
            username,
            password: hashedPassword,
            profile_image: { data: Buffer, contentType: String },
            role: 'user',
        };

        await db.collection('users').insertOne(createUser);
        res.redirect('/profile');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login
app.post('/api/login', upload.none(), async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const findEmail = await db.collection('users').findOne({ email });
        if (!findEmail) {
            return res.status(400).json({ error: 'Email not found' });
        }

        const match = await matchPassword(password, findEmail.password);
        if (!match) {
            return res.status(400).json({ error: 'Password does not match' });
        }

        const payload = { id: findEmail._id, role: findEmail.role };
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/home');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Change Password
app.put('/api/changepassword', async (req, res) => {
    try {
        const { id, password, newpassword } = req.body;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const findUser = await db.collection("users").findOne({ _id: new ObjectId(id) });
        if (!findUser) {
            return res.status(400).send("User not found");
        }

        const match = await matchPassword(password, findUser.password);
        if (!match) {
            return res.status(400).send("Wrong password");
        }

        const hash = await hashPassword(newpassword);
        await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { password: hash } });
        res.status(200).send("Change Password Success");
    } catch (error) {
        console.error('Error:', error);
    }
});

// Middleware to check if user is logged in
app.get('/api/checkToken', (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: "No token" });
        }

        const decode = jwt.verify(token, secret);
        res.status(200).send({ message: "Token present", token: decode });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: "Something went wrong" });
    }
});

// Edit Account
app.post('/api/edit', async (req, res) => {
    try {
        const { username } = req.body;
        const token = req.cookies.token;
        const decode = jwt.verify(token, secret);
        const id = decode.id;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const updateUser = db.collection("users");
        await updateUser.updateOne(
            { _id: new ObjectId(id) },
            { $set: { username } }
        );

        res.redirect('/profile');
    } catch (error) {
        console.error('Error:', error);
    }
});

// Logout
app.get('/api/logout', (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
    }
});

// Get all users
app.get('/admin/getallusers', async (req, res) => {
    try {
        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const result = await db.collection("users").find({ role: "user" }).toArray();
        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Get Account by ID
app.get('/api/getAccount/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const findUser = await db.collection("users").findOne({ _id: new ObjectId(id) });
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(findUser);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete Account
app.delete('/api/deleteuser/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Add Fridge Item
app.post('/admin/addItem', async (req, res) => {
    try {
        const { itemName, quantity, expiryDate } = req.body;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        if (!itemName) {
            return res.status(400).send({ message: "Please enter item name" });
        }

        const itemData = {
            itemName,
            quantity,
            expiryDate,
        };

        const result = await db.collection("items").insertOne(itemData);
        res.status(200).send({ result });
    } catch (error) {
        console.error('Error:', error);
    }
});

// Delete Fridge Item
app.delete('/admin/deleteItem/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const result = await db.collection("items").deleteOne({ _id: new ObjectId(id) });
        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Edit Fridge Item
app.post('/admin/editItem', async (req, res) => {
    try {
        const { id, itemName, quantity, expiryDate } = req.body;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const updateItem = db.collection("items");
        const result = await updateItem.updateOne(
            { _id: new ObjectId(id) },
            { $set: { itemName, quantity, expiryDate } }
        );

        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
