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

const updateUserProfile = async ({ username, email }) => {
    try {
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        const result = await db.collection('users').updateOne(
            { $set: {email }},
            { $set: { username } }
        );

        return { success: true };
    } catch (error) {
        console.error('Database error:', error.message, error.stack);
        return { success: false, error: 'Database error' };
    }
};

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // Add user data to request object
        next();
    });
};


const matchPassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Error matching password', error);
    }
};

app.post('/api/verifyPassword', authenticateToken, async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            return res.status(200).json({ match: true });
        } else {
            return res.status(400).json({ match: false });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



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
        const { username, email } = req.body;

        if (!username || !email) {
            return res.status(400).send({ error: 'Missing required fields' });
        }

        console.log('Received request to update profile:', req.body);

        const result = await updateUserProfile({ username, email });

        if (result.success) {
            res.status(200).send({ message: 'Profile updated successfully' });
        } else {
            res.status(500).send({ error: 'Failed to update profile', details: result.error });
        }
    } catch (error) {
        console.error('Error updating profile:', error.message, error.stack);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});

app.get('/api/logout', (req, res) => {
    try {
        res.clearCookie('token'); 
        res.status(200).send({ message: 'Logout successful' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Logout failed' });
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

app.post('/api/createFridge', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body; // Get the name from the request body

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const joinKey = uuidv4();

        const fridgeData = {
            name, // Use the provided name
            owner: userId,
            joinKey,
            members: [userId],
            items: []
        };

        const result = await db.collection("fridges").insertOne(fridgeData);
        res.status(200).send({ result, joinKey });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while creating the fridge' });
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

app.get('/fridges', async (req, res) => {
try {
    const fridges = await Fridge.find({}, 'name');
    const fridgeNames = fridges.map(fridge => fridge.name);
    res.json(fridgeNames);
} catch (error) {
    console.error('Error fetching fridge names:', error);
    res.status(500).json({ message: 'Internal server error' });
}
});



app.get('/api/fridgeNames', async (req, res) => {
    try {
        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const fridgeNames = await db.collection("fridges").distinct("name");
        res.status(200).json({ fridgeNames });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/addItem', async (req, res) => {
    try {
        const token = req.cookies.token; // Assuming the token is stored in cookies
        if (!token) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, secret);
        const userId = decoded.userId; // Assuming the token contains the userId

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
            expiryDate,
            addedBy: userId // Include the user ID of the person who added the item
        };

        const result = await db.collection("fridges").updateOne(
            { _id: new ObjectId(FridgeID) },
            { $push: { items: newItem } }
        );

        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: "Something went wrong" });
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


app.get('/api/getUser', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the authenticated token

        if (!db) {
            console.error('Database connection not established');
            return res.status(500).json({ error: 'Database connection not established' });
        }

        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) }, { projection: { username: 1, email: 1 } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
