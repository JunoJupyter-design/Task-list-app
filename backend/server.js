// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Allows us to use environment variables

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in the request body

// --- MongoDB Connection ---
// It's best practice to store your connection string in a .env file
const mongoURI = process.env.MONGO_URI || "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskdb?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully."))
.catch(err => console.error("MongoDB connection error:", err));

// --- Mongoose Schema and Model ---
// This defines the structure of the documents in our tasks collection
const taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Task = mongoose.model('Task', taskSchema);

// --- API Endpoints (Routes) ---

// GET /api/tasks - Fetch all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }); // Get latest tasks first
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ message: "Server error while fetching tasks" });
    }
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: "Task text is required" });
        }
        const newTask = new Task({ text });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ message: "Server error while creating task" });
    }
});

// PUT /api/tasks/:id - Update a task (for text or completion status)
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text, isCompleted } = req.body;
        
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { text, isCompleted },
            { new: true } // Return the updated document
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(updatedTask);
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ message: "Server error while updating task" });
    }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({ message: "Server error while deleting task" });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // --- MongoDB Connection ---
// const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager';

// mongoose.connect(mongoURI)
//     .then(() => console.log("MongoDB connected successfully."))
//     .catch(err => console.error("MongoDB connection error:", err));

// // --- Task Schema and Model ---
// const taskSchema = new mongoose.Schema({
//     text: { type: String, required: true },
//     isCompleted: { type: Boolean, default: false }
// }, { timestamps: true });

// const Task = mongoose.model('Task', taskSchema);

// // --- API Routes ---
// const router = express.Router();

// // GET all tasks
// router.get('/', async (req, res) => {
//     try {
//         const tasks = await Task.find().sort({ createdAt: -1 });
//         res.json(tasks);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // POST a new task
// router.post('/', async (req, res) => {
//     if (!req.body.text || req.body.text.trim() === '') {
//         return res.status(400).json({ message: "Task text cannot be empty." });
//     }

//     try {
//         // --- CHANGE: Check for existing task (case-insensitive) ---
//         const existingTask = await Task.findOne({ 
//             text: { $regex: new RegExp(`^${req.body.text.trim()}$`, 'i') } 
//         });

//         if (existingTask) {
//             // Send a 409 Conflict status if a duplicate is found
//             return res.status(409).json({ message: 'This task already exists.' });
//         }
//         // --- END CHANGE ---

//         const task = new Task({
//             text: req.body.text.trim(),
//             isCompleted: req.body.isCompleted || false
//         });

//         const newTask = await task.save();
//         res.status(201).json(newTask);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // PUT (update) a task
// router.put('/:id', async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({ message: 'Task not found' });

//         if (req.body.text != null) {
//             task.text = req.body.text;
//         }
//         if (req.body.isCompleted != null) {
//             task.isCompleted = req.body.isCompleted;
//         }

//         const updatedTask = await task.save();
//         res.json(updatedTask);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // DELETE a task
// router.delete('/:id', async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({ message: 'Task not found' });

//         await task.deleteOne();
//         res.json({ message: 'Task deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// app.use('/api/tasks', router);

// // --- Start Server ---
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
