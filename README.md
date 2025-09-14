Full-Stack Task Manager
This is a complete task management application built with the MERN stack (MongoDB, Express, React, Node.js). It provides a clean and responsive user interface for managing daily tasks.

Features
Full CRUD Functionality: Create, Read, Update, and Delete tasks.

Task Filtering: View all, active, or completed tasks.

Progress Tracking: A visual progress bar shows your completion percentage.

Responsive Design: Seamless experience on both desktop and mobile devices.

Edit on Double-Click: Quickly edit tasks by double-clicking on them.

Clear Completed: A one-click button to remove all finished tasks.

Tech Stack
Frontend: React.js, Tailwind CSS, Axios

Backend: Node.js, Express.js

Database: MongoDB (with Mongoose)

Setup and Installation
To run this project locally, follow these steps:

1. Clone the repository:
git clone https://github.com/JunoJupyter-design/Task-list-app
cd task-list-app


2. Setup the Backend:

cd backend
npm install

Create a .env file in the backend directory.

Add your MongoDB connection string to the .env file:
MONGO_URI="your_mongodb_connection_string"


3. Setup the Frontend:

cd ../frontend
npm install

4. Run the Application:

In one terminal, run the backend server:

cd ../backend
node server.js

In a second terminal, run the frontend React app:

cd ../frontend
npm start
