const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// MongoDB connection string
const url = 'mongodb+srv://webject2:SbtDTeIU9pIIs8b3@loginweb2.wtpq5wl.mongodb.net/';

// Connect to MongoDB using Mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Define salt rounds for bcrypt
const saltRounds = 5;

// Define middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("GET Request Called")
})
 
app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});
// Sign Up
app.post('/api/signup', upload.none(), async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const db = client.db('MyFridgeInventory');
        const findEmail = await db.collection('users').findOne({ email });

        if (findEmail) {
            return res.status(409).json({ error: 'Email already used!' });
        }

        const createUser = {
            email,
            username,
            password: await hashPassword(password),
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
        await connectDB();
        const { email, password } = req.body;
        const findEmail = await client.db('MyFridgeInventory').collection('users').findOne({ email });
        if (!findEmail) {
            res.status(400).json({ error: 'Email not found' });
            return false;
        }
        const matchPassword = await matchPassword(password, findEmail.password);
        if (!matchPassword) {
            res.status(400).json({ error: 'Password does not match' });
            return false;
        }

        const payload = { id: findEmail._id, role: findEmail.role };
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/home');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Change Password
app.put('/api/changepassword', async (req, res) => {
    try {
        const { id, password, newpassword } = req.body;
        await connectDB();
        const findUser = await client.db("MyFridgeInventory").collection("users").findOne({ _id: new ObjectId(id) });
        if (!findUser) {
            return res.status(400).send("User not found");
        }
        const match = await matchPassword(password, findUser.password);
        if (!match) {
            return res.status(400).send("Wrong password");
        }
        const hash = await hashPassword(newpassword);
        await client.db("MyFridgeInventory").collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { password: hash } });
        res.status(200).send("Change Password Success");
    } catch (error) {
        console.log("Error", error);
    }
});

// Middleware, Check if user logged in
app.get('/api/checkToken', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: "No token" });
        }
        const decode = jwt.verify(token, secret);
        res.status(200).send({ message: "Token present", token: decode });
    } catch (error) {
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

        const updateUser = client.db("MyFridgeInventory").collection("users");
        const result = await updateUser.updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: { username } }
        );

        res.redirect('/profile');
    } catch (error) {
        console.error(error);
    }
});

// Logout
app.get('/api/logout', (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

// Get all users
app.get('/admin/getallusers', async (req, res) => {
    try {
        await connectDB();
        const result = await client.db("MyFridgeInventory").collection("users").find({ role: "user" }).toArray();
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
    }
});

// Get Account by ID
app.get('/api/getAccount/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await connectDB();
        const findUser = await client.db("MyFridgeInventory").collection("users").findOne({ _id: new ObjectId(id) });
        if (!findUser) {
            res.status(404).json({ message: "User not found" });
            return false;
        }
        res.status(200).json(findUser);
    } catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete Account
app.delete('/api/deleteuser/:id', async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        const result = await client.db("MyFridgeInventory").collection("users").deleteOne({ _id: new ObjectId(id) });
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
    }
});

// Add Fridge Item
app.post('/admin/addItem', async (req, res) => {
    try {
        await connectDB();
        const { itemName, quantity, expiryDate } = req.body;
        if (!itemName) {
            res.status(400).send({ message: "Please enter item name" });
            return false;
        }
        const itemData = {
            itemName,
            quantity,
            expiryDate,
        };
        const result = await client.db("MyFridgeInventory").collection("items").insertOne(itemData);
        res.status(200).send({ result });
    } catch (error) {
        console.log(error);
    }
});

// Delete Fridge Item
app.delete('/admin/deleteItem/:id', async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        const result = await client.db("MyFridgeInventory").collection("items").deleteOne({ _id: new ObjectId(id) });
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
    }
});

// Edit Fridge Item
app.put('/admin/editItem', async (req, res) => {
    try {
        await connectDB();
        const { id, itemName, quantity, expiryDate } = req.body;
        const updateItem = client.db("MyFridgeInventory").collection("items");
        const result = await updateItem.updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: { itemName, quantity, expiryDate } }
        );
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
    }
});

// Get All Fridge Items
app.get('/admin/getItems', async (req, res) => {
    try {
        await connectDB();
        const result = await client.db("MyFridgeInventory").collection("items").find({}).toArray();
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
    }
});

// Get Fridge Item by ID
app.get('/admin/getItem/:id', async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        const result = await client.db("MyFridgeInventory").collection("items").findOne({ _id: new mongoose.Types.ObjectId(id) });
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
    }
});
