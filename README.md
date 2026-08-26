# 🎓 Eduna

### 🌐 A Virtual Campus for Learning, Collaboration & Competition

> **Eduna transforms the digital university experience into an interactive virtual campus where students can meet, learn, collaborate, compete, and access academic resources — all from one place.**

---

## ✨ What is Eduna?

Modern student life is fragmented across multiple platforms.

You might use one platform for:
- 👨‍💻 Coding practice
- 📚 Learning resources
- 🤝 Meetings
- 🏆 Competitions
- 👥 Communication
- 🏫 University activities

**Eduna brings these experiences together inside one virtual campus.**

Instead of navigating through a collection of disconnected websites, students enter a shared digital campus and interact with these services through different spaces.

> **The campus becomes the interface.**

---

# 🚀 Features

## 🏫 Interactive Virtual Campus

Explore a virtual university campus using a controllable avatar.

Students can move around the campus and interact with different locations such as:

- 💻 Coding Space
- 🤝 Meeting Space
- 📚 Library
- 🏆 Leaderboard
- 🌐 Other campus areas

---

## 👥 Real-Time Multiplayer

Eduna isn't a single-player campus.

Multiple students can occupy the same virtual environment simultaneously.

Powered by **Socket.IO**, the system synchronizes:

- Player joining
- Player movement
- Player direction
- Player disconnection
- Currently active players

### Example Flow

```text
Student A
    │
    │ movement
    ▼
Socket.IO Server
    │
    │ real-time event
    ▼
Student B

```

This makes the campus feel like an actual shared environment rather than a static website.

## 💻 Coding Space

Students can enter a dedicated coding environment directly from the campus.

Current MVP includes:
🧩 Programming problems
📝 Problem descriptions
📥 Input format
📤 Output format
📌 Constraints
🧪 Test cases
💻 Code editor
🚀 Code submission
🏆 Leaderboard


## Example Problem
Two Sum

Given an array of integers nums and an integer target,
return the indices of the two numbers such that they
add up to target.

Students can write and submit their solution without leaving the Eduna environment.

## 🏆 Leaderboard

Coding performance can be reflected through a leaderboard.

Students can:

Track their performance
Compare scores
Compete with other students
Participate in a more engaging coding environment

This introduces a competitive layer to the learning experience.

## 🤝 Meeting & Collaboration

Eduna also provides a meeting experience for collaborative learning.

Students can:

View available meetings
Join scheduled sessions
Collaborate with other students
Move between independent learning and group activities

The goal is to connect individual learning + collaborative learning inside the same campus.

## 📚 Digital Library

The library provides curated technical learning resources.

Resources can be organized into categories such as:

DSA
Web Development
AI/ML
DBMS
Computer Networks
Other

Each resource can contain:

Title
Description
Category
Resource Type
URL
Thumbnail

The system supports different resource types including:

📄 PDF
🎥 Video
🌐 Website
📰 Article

For the university's existing digital library, Eduna can also act as an entry point rather than attempting to rebuild an entire library system.

## 🔐 Authentication

Eduna includes user authentication to provide personalized experiences.

The backend supports:

User registration
User login
JWT-based authentication
Google authentication integration
Protected user functionality
☁️ Cloud Deployment

Eduna is designed to run as a complete cloud application.

```text

                   ┌─────────────────────┐
                   │      Vercel         │
                   │   React + Vite      │
                   └──────────┬──────────┘
                              │
                              │ HTTPS
                              ▼
                   ┌─────────────────────┐
                   │       Render        │
                   │ Node.js + Express   │
                   │     + Socket.IO     │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │    MongoDB Atlas    │
                   │      Database       │
                   └─────────────────────┘

```

## 🛠️ Tech Stack
Frontend
```
Technology	Purpose
⚛️ React	UI & application architecture
⚡ Vite	Development & production build
🎨 CSS	Styling & UI
🔌 Socket.IO Client	Real-time multiplayer
🧭 React Router	Application navigation
```

Backend
```
Technology	Purpose
🟢 Node.js	Runtime
🚂 Express.js	REST API
🔌 Socket.IO	Real-time communication
🔐 JWT	Authentication
🔑 Google OAuth	Google authentication
🗄️ Mongoose	MongoDB object modeling
Database
```

MongoDB Atlas

Used for:

Users
Problems
Submissions
Rooms
Leaderboards
Meetings
Learning resources
Deployment
Service	Purpose
▲ Vercel	Frontend
🚀 Render	Backend
🍃 MongoDB Atlas	Database


### 📂 Project Structure
```
xyz/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Campus.jsx
│   │   │   └── CodingSpace.jsx
│   │   │
│   │   ├── components/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── seedProblem.js
│   ├── server.js
│   └── package.json
│
└── README.md

```

## ⚙️ Getting Started 

1️⃣ Clone the repository
git clone https://github.com/Rishu2913/xyz.git
cd xyz

2️⃣ Setup Backend
cd server
npm install

Create a .env file:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
GOOGLE_REFRESH_TOKEN=your_google_refresh_token

Start the backend:

npm start

Backend runs on:

http://localhost:5000

3️⃣ Setup Frontend

Open another terminal:

cd client
npm install

Start the development server:

npm run dev

Frontend runs on:

http://localhost:5173
🧪 Production Build

Before deploying the frontend, verify that the production build works:

cd client
npm run build

The generated production files will be placed inside:

client/dist/
🌍 Environment Configuration

For production, the frontend should communicate with the deployed backend:

VITE_API_URL=https://your-render-backend-url

The backend requires the MongoDB Atlas connection string.

## ⚠️ Never commit .env files or API secrets to GitHub.

## 🔌 API Overview

Authentication
```
POST /api/auth/register
POST /api/auth/login
Problems
GET /api/problems/:id
Rooms
GET /api/rooms/:id
POST /api/rooms/:id/join
Submissions
POST /api/submissions
Leaderboard
GET /api/leaderboard
Meetings
GET /api/meetings/latest
GET /api/meetings
```

## ⚡ Real-Time Events

Socket.IO powers the multiplayer experience.

Client → Server
player:join
player:move
Server → Client
players:current
player:joined
player:moved
player:left

This allows the campus to synchronize player states in real time.

## 🧠 Product Philosophy

Eduna isn't trying to replace every educational platform.

Instead, it creates a common interactive layer around the existing student experience.

```

                ┌───────────────┐
                │    EDUNA      │
                │ Virtual Campus│
                └───────┬───────┘
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   💻 Coding       🤝 Meetings       📚 Resources
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                 🏆 Competition

```

The goal is simple:

Turn the digital university from a collection of tabs into a place.

## 🗺️ Roadmap

✅ MVP
```
 User authentication
 Virtual campus
 Avatar movement
 Real-time multiplayer
 Coding Space
 Coding problems
 Submissions
 Leaderboard
 Meeting integration
 Digital learning resources
 Cloud deployment
```
 
🔮 Future
```
 More interactive campus buildings
 Real-time chat
 Campus events
 Coding competitions
 More coding problems
 Personalized learning paths
 Course-specific spaces
 Notifications
 Student profiles
 University system integrations
 Richer multiplayer interactions
```

## 👨‍💻 Team

Built with ❤️ during a hackathon.

Contributors
```
Rishu Raj Singh
Deepanshu Karki
Khushboo Sharma
Chaman Kumar
Piyush Samal
Vinay Tiwari
```

##🎯 Why Eduna?

Traditional educational platforms answer:

"Where is the content?"

Eduna asks:

"Where are the students?"

We believe learning becomes more engaging when students can see, meet, collaborate and compete with others.

## ⭐ Support

If you like the idea behind Eduna, consider giving the repository a ⭐.
