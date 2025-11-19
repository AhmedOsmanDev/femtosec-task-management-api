# Femto Security Task Management API

A RESTful API for task management with role-based access control, built with Node.js, Express, and MongoDB.

## ✨ Features

- 🔐 JWT-based authentication
- 👥 Role-based access control (Admin & Normal User)
- 📝 Complete CRUD operations for tasks
- 🔍 Task filtering and pagination
- 🐳 Docker support
- ✅ Input validation
- 🔒 Password hashing with bcrypt

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Password Hashing:** bcrypt
- **Containerization:** Docker

## 📦 Prerequisites

- Node.js (v18+)
- MongoDB (v4.4+)
- Docker (optional)

## 📥 Installation

### Clone the Repository

```bash
git clone https://github.com/AhmedOsmanDev/femtosec-task-management-api.git
cd femtosec-task-management-api
```

### Install Dependencies

```bash
npm install
```

## ⚙️ Configuration

### Create Environment File

```bash
cp .env.example .env
```

### Edit `.env` File

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/femtosec-task-management-api
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=24h
```

## 🚀 Running Locally

### Start Development Server

```bash
npm run dev
```

### Start Production Server

```bash
npm start
```

The server will run at: http://localhost:3000

## 🐳 Running with Docker

### Build and Run

```bash
# Build image
docker build -t femtosec-task-api .

# Run container
docker run -d -p 3000:3000 --name femtosec-task-api --env-file .env femtosec-task-api
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register new user |
| POST | `/users/login` | Login user |

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tasks` | Get all tasks | ✅ |
| POST | `/tasks` | Create task | ✅ |
| PATCH | `/tasks/:id` | Update task | ✅ |
| DELETE | `/tasks/:id` | Delete task | ✅ |

## 🔐 Authentication

### Register

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Use Token

```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 👥 User Roles

### Normal User
- View own tasks
- Create, update, delete own tasks

### Admin
- View all tasks
- Update/delete any task

### Create Admin

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "username": "admin",
    "email": "admin@femtosec.com",
    "password": "admin123",
    "role": "admin"
  }'
```

## 📁 Project Structure

```
femtosec-task-management-api/
├── src/
│   ├── models/
│   │   ├── tasks/          # Task models & controllers
│   │   └── users/          # User models & controllers
│   ├── shared/
│   │   ├── middlewares/    # Auth & error handling
│   │   └── utils/          # Validators & utilities
│   ├── app.js              # Express app
│   ├── server.js           # Server entry point
│   └── database.js         # MongoDB connection
├── .env                    # Environment variables
├── Dockerfile              # Docker configuration
└── package.json            # Dependencies
```

## 🎯 Usage Examples

### Create Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete documentation",
    "description": "Add README file",
    "status": "in-progress",
    "dueDate": "2025-12-31T23:59:59Z"
  }'
```

### Get Tasks with Filters

```bash
# Get all tasks
curl -X GET "http://localhost:3000/tasks?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by status
curl -X GET "http://localhost:3000/tasks?status=in-progress" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Task

```bash
curl -X PATCH http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

### Delete Task

```bash
curl -X DELETE http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Docker Commands

```bash
# Build
docker build -t femtosec-task-api .

# Run
docker run -d -p 3000:3000 --name femtosec-task-api --env-file .env femtosec-task-api

# View logs
docker logs -f femtosec-task-api

# Stop
docker stop femtosec-task-api

# Remove
docker rm femtosec-task-api
```

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | Deleted |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

## 🔧 Troubleshooting

**MongoDB Connection Error:**
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env`

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Invalid JWT Token:**
- Check token hasn't expired
- Verify `JWT_SECRET_KEY` matches
- Use format: `Bearer <token>`

## 📝 License

GPL-2.0 License

## 👤 Author

**Ahmed Osman**
- Email: ahmed.osman@tuta.io
- GitHub: [@AhmedOsmanDev](https://github.com/AhmedOsmanDev)

---

Made with ❤️ by Ahmed Osman for Femto Security
