import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// ==================================================================================
// Configuration
// ==================================================================================
// This points to the backend server you have running on port 5001.
const API_BASE_URL = 'http://localhost:5001/api';


// ==================================================================================
// SVG Icons
// A good practice to keep icons as reusable components instead of cluttering JSX.
// ==================================================================================
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
    </svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)

// ==================================================================================
// Main App Component
// This is the core of our application.
// ==================================================================================
function App() {
    // --- State Management ---
    const [tasks, setTasks] = useState([]); // Holds the list of all tasks
    const [newTaskText, setNewTaskText] = useState(''); // Text for the new task input
    const [editingTaskId, setEditingTaskId] = useState(null); // Which task is currently being edited
    const [editingTaskText, setEditingTaskText] = useState(''); // The text of the task being edited
    const [isLoading, setIsLoading] = useState(true); // To show a loading message
    const [error, setError] = useState(null); // To show any error messages
    const editInputRef = useRef(null); // To auto-focus the edit input field

    // --- Data Fetching (useEffect) ---
    // This runs once when the component first loads to get all tasks from the server.
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/tasks`);
                setTasks(response.data);
            } catch (err) {
                console.error("Error fetching tasks:", err);
                setError("Could not fetch tasks. Please ensure the backend server is running and accessible.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // --- Event Handlers for Task Operations ---

    // Handles submitting the form to add a new task
    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;

        try {
            const response = await axios.post(`${API_BASE_URL}/tasks`, { text: newTaskText });
            setTasks([response.data, ...tasks]); // Add new task to the start of the array
            setNewTaskText('');
        } catch (err) {
            setError("Failed to add task.");
            console.error("Add Task Error:", err);
        }
    };
    
    // Handles deleting a task by its ID
    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/tasks/${id}`);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (err) {
            setError("Failed to delete task.");
            console.error("Delete Task Error:", err);
        }
    };
    
    // Handles toggling the 'isCompleted' status of a task
    const handleToggleComplete = async (task) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tasks/${task._id}`, { 
                isCompleted: !task.isCompleted 
            });
            setTasks(tasks.map(t => (t._id === task._id ? response.data : t)));
        } catch (err) {
            setError("Failed to update task status.");
            console.error("Toggle Complete Error:", err);
        }
    };
    
    // Puts a task into "edit mode"
    const startEditing = (task) => {
        setEditingTaskId(task._id);
        setEditingTaskText(task.text);
    };

    // Handles saving the changes to an edited task
    const handleSaveEdit = async (id) => {
        if (!editingTaskText.trim()) {
            // If the user clears the text, delete the task instead
            handleDeleteTask(id);
            return;
        }

        try {
            const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, { text: editingTaskText });
            setTasks(tasks.map(t => (t._id === id ? response.data : t)));
        } catch (err) {
            setError("Failed to save changes.");
            console.error("Save Edit Error:", err);
        } finally {
            // Exit edit mode
            setEditingTaskId(null);
            setEditingTaskText('');
        }
    };

    // Auto-focus the input field when edit mode is activated
    useEffect(() => {
        if (editingTaskId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingTaskId]);

    // --- JSX Rendering ---
    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">

                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Task Manager
                    </h1>
                    <p className="text-gray-400 mt-2">Built with React & Node.js</p>
                </header>
                
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-center" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAddTask} className="mb-8 flex gap-3">
                    <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-grow bg-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                    <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:scale-100" disabled={!newTaskText.trim()}>
                        Add
                    </button>
                </form>

                <div className="space-y-4">
                    {isLoading ? (
                        <p className="text-center text-gray-400 py-4">Loading your tasks...</p>
                    ) : tasks.length > 0 ? (
                        tasks.map(task => (
                            <div key={task._id} className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-4 shadow-md transition-all duration-300 hover:shadow-cyan-500/20 hover:bg-gray-700">
                                <button onClick={() => handleToggleComplete(task)} className={`w-7 h-7 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${task.isCompleted ? 'border-cyan-500 bg-cyan-500' : 'border-gray-500 hover:border-cyan-400'}`}>
                                    {task.isCompleted && <CheckIcon />}
                                </button>
                                
                                {editingTaskId === task._id ? (
                                    <input
                                        ref={editInputRef}
                                        type="text"
                                        value={editingTaskText}
                                        onChange={(e) => setEditingTaskText(e.target.value)}
                                        onBlur={() => handleSaveEdit(task._id)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(task._id)}
                                        className="flex-grow bg-transparent text-white focus:outline-none"
                                    />
                                ) : (
                                    <span onDoubleClick={() => startEditing(task)} className={`flex-grow cursor-pointer ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                                        {task.text}
                                    </span>
                                )}
                                
                                <div className="flex items-center gap-2">
                                    <button onClick={() => startEditing(task)} className="text-gray-400 hover:text-yellow-400 p-2 rounded-full transition-colors">
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => handleDeleteTask(task._id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors">
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">All clear! No tasks to show.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;

