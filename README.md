🌐 LNMIIT Campus Connect (LCC)

A full-stack social networking platform built for LNMIIT students to connect, share posts, and collaborate.
Built with React, Node.js, Express, and MySQL.

🚀 Features

🔐 User Authentication (JWT + Google Login)

🧑‍🤝‍🧑 Profiles with followers/following

📝 Post creation with images & comments

💬 Real-time comment updates

📰 Personalized feed

🌈 Responsive UI using SCSS + React

🛠️ Tech Stack

Frontend: React, Axios, SCSS, Context API
Backend: Node.js, Express, JWT, Google OAuth
Database: MySQL (with connection pooling)
Deployment: Vercel (frontend) + Render (backend)

⚙️ Setup & Installation
1️⃣ Clone the repo
git clone https://github.com/your-username/LCC.git
cd LCC

2️⃣ Install dependencies
cd backend
npm install
cd ../frontend
npm install

3️⃣ Setup environment variables

Create a .env file in both backend/ and frontend/ directories.

Backend .env

PORT=8800
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=lnmiit_campus_connect
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id


Frontend .env

VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id

4️⃣ Run locally
# Backend
cd backend
npm start

# Frontend
cd ../frontend
npm run dev

🌍 Live Demo

🔗 Frontend: https://lcc-frontend.vercel.app

🔗 Backend API: https://lcc-backend.onrender.com

🤝 Contributing

Contributions are welcome!
Please fork the repo and submit a pull request.

📄 License

This project is licensed under the MIT License.
