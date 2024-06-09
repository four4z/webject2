const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const uuid = require('uuid');
const app = express();
const port = 3000;
const upload = multer();
const secret = "GN0000"

let db;
let client;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: ['http://localhost:5173'] }));

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
app.use(async (req, res, next) => {
    if (!client || !client.topology || !client.topology.isConnected()) {
        console.log("Reconnecting to MongoDB...");
        await connectDB();
    }
    next();
});


const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password', error);
    }
};


const matchPassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Error matching password', error);
    }
};


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
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!db) {
        console.error('Database connection not established');
        return res.status(500).json({ error: 'Database connection not established' });
      }
  
      const user = await db.collection('users').findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Email not found' });
      }
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ error: 'Password does not match' });
      }
  
      const payload = { id: user._id, role: user.role };
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

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

// check log in status
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

app.post('/api/editaccount', async (req, res) => {
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

app.get('/api/logout', (req, res) => {
    try {
        res.clearCookie('token');
    } catch (error) {
        console.error('Error:', error);
    }
});

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

app.post('/api/joinFridge', async (req, res) => {
    try {
        const { joinKey, user } = req.body;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        if (!joinKey || !user) {
            return res.status(400).send({ message: "Please provide join key and user" });
        }

        const fridge = await db.collection("fridges").findOne({ joinKey });
        if (!fridge) {
            return res.status(400).send({ message: "Invalid join key" });
        }

        // Add user to the fridge's members if not already a member
        if (!fridge.members.includes(user)) {
            await db.collection("fridges").updateOne(
                { joinKey },
                { $push: { members: user } }
            );
        }

        res.status(200).send({ message: "Joined fridge successfully" });
    } catch (error) {
        console.error('Error:', error);
    }
});

app.post('/api/createFridge', async (req, res) => {
    try {
        const { name, owner } = req.body;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        if (!name || !owner) {
            return res.status(400).send({ message: "Please enter fridge name and owner" });
        }

        const joinKey = uuidv4(); // Generate a unique join key

        const fridgeData = {
            name,
            owner,
            joinKey,
            members: [owner], // Initialize with the owner as a member
            items: []
        };

        const result = await db.collection("fridges").insertOne(fridgeData);
        res.status(200).send({ result, joinKey }); // Send the join key to the client
    } catch (error) {
        console.error('Error:', error);
    }
});

app.put('/editFridge/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const result = await db.collection("fridges").updateOne(
            { _id: new ObjectId(id) },
            { $set: { name } }
        );

        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
    }
});


app.delete('/deleteFridge/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const result = await db.collection("fridges").deleteOne({ _id: new ObjectId(id) });
        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
    }
});

app.post('/addItem', async (req, res) => {
    try {
        const { FridgeID, Itemname, Quantity, expiryDate } = req.body;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        if (!FridgeID || !Itemname || !Quantity || !expiryDate) {
            return res.status(400).send({ message: "Please provide all required fields" });
        }

        const newItem = {
            _id: new ObjectId(),
            Itemname,
            Quantity,
            expiryDate
        };

        const result = await db.collection("fridges").updateOne(
            { _id: new ObjectId(FridgeID) },
            { $push: { items: newItem } }
        );

        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
    }
});

app.delete('/deleteItem/:FridgeID/:ItemID', async (req, res) => {
    try {
        const { FridgeID, ItemID } = req.params;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const result = await db.collection("fridges").updateOne(
            { _id: new ObjectId(FridgeID) },
            { $pull: { items: { _id: new ObjectId(ItemID) } } }
        );

        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
    }
});

app.put('/editItem/:FridgeID/:ItemID', async (req, res) => {
    try {
        const { FridgeID, ItemID } = req.params;
        const { Itemname, Quantity, expiryDate } = req.body;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const result = await db.collection("fridges").updateOne(
            { _id: new ObjectId(FridgeID), "items._id": new ObjectId(ItemID) },
            { $set: { "items.$.Itemname": Itemname, "items.$.quantity": Quantity, "items.$.expiryDate": expiryDate } }
        );

        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
    }
});

app.get('/api/getUserFridges/:user', async (req, res) => {
    try {
        const { user } = req.params;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const userFridges = await db.collection("fridges").find({ members: user }).toArray();
        res.status(200).send(userFridges);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
