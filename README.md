🌐 LNMIIT Campus Connect (LCC)

A full-stack social networking platform built for LNMIIT students to connect, share posts, and collaborate.
Developed using React, Node.js, Express, and MySQL — featuring authentication, image uploads, and a responsive UI.

🚀 Features

🔐 User Authentication (JWT + Google Login)

👥 Profile Management (Follow/Unfollow system)

📝 Create & View Posts with images

💬 Comment System (Real-time updates)

📰 Personalized Feed for each user

🌈 Responsive UI (SCSS + React)

🛠️ Tech Stack
Layer	Technologies
Frontend	React, Axios, SCSS, Context API
Backend	Node.js, Express.js, JWT, Google OAuth
Database	MySQL (with connection pooling)
Deployment	Vercel (Frontend) + Render (Backend)
⚙️ Setup & Installation
🧩 1️⃣ Clone the Repository
git clone https://github.com/your-username/LCC.git
cd LCC

📦 2️⃣ Install Dependencies

Backend

cd backend
npm install


Frontend

cd ../frontend
npm install

🔐 3️⃣ Setup Environment Variables

Create a .env file in both backend and frontend directories.

🗄️ Backend .env

PORT=8800
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=lnmiit_campus_connect
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id


🌍 Frontend .env

VITE_API_URL=https://lcc-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id

🧠 4️⃣ Run Locally
▶️ Start Backend
cd backend
npm start

💻 Start Frontend

Navigate to the frontend folder:

cd ../frontend


Now, start the development server:

npm run dev

🌍 Live Demo

🔗 Frontend: https://lcc-frontend.vercel.app

🔗 Backend API: https://lcc-backend.onrender.com

📸 Preview

Coming soon: Screenshots of UI (Login, Feed, Profile, Comments, etc.)

🤝 Contributing

Contributions are always welcome!

Fork the repository

Create a new branch (feature/your-feature-name)

Commit your changes

Push to your branch

Open a Pull Request

🧑‍💻 Developer

👤 Sheetal Sharma

📧 your-email@example.com

🌐 GitHub Profile

📄 License

This project is licensed under the MIT License.
You’re free to use, modify, and distribute this software with attribution.

⭐ Support

If you like this project, please ⭐ Star the repository — it helps others discover it!

🏷️ Keywords

React • Node.js • Express • MySQL • Google Login • JWT • Full Stack • Campus Connect • Social Media App • LNMIIT
