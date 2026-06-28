# AI Resume Analyzer 

An AI-powered Resume Analyzer web application that helps users analyze their resumes, identify skills, calculate match scores, and get useful career insights.

## Features

- Upload Resume PDF
- Extract resume text automatically
- AI-based resume analysis
- Detect technical skills
- Identify matched skills
- Find missing skills
- Generate resume match score
- User registration and login
- Secure authentication using JWT

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- Multer
- PDF Parser
- JWT Authentication

### Database

- MongoDB

### AI Integration

- Cohere API

## Project Structure

```text
AI-Resume-Analyzer

├── client
│   └── React Frontend
│
├── server
│   └── Node.js Backend
│
├── .gitignore
└── README.md
```

## Installation

### Clone Repository
```text
git clone your-repository-link
```
### Frontend Setup
```text
cd client
npm install
npm start
```
### Backend Setup
```text
cd server
npm install
npm run dev
```
### Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
AI_API_KEY=your_api_key
```

### Application Flow

1. User creates an account
2. User uploads resume PDF
3. Backend extracts resume content
4. AI analyzes resume data
5. Skills and score are generated
6. User views analysis result

### Author

Maheswari