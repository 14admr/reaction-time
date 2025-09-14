# Reaction Time Test

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-00C7B7?style=flat&logo=vercel)](https://reaction-time-chi.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render)](https://reaction-time-backend.onrender.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)](https://nodejs.org/)

A modern web application built with React and Node.js for measuring human reaction times. This project demonstrates cognitive assessment through an interactive game that tests users' response times to visual stimuli.

> **Note**: This project is a fork and modernization of the original [reaction-time repository](https://github.com/PERSEUS-1337/reaction-time) by PERSEUS-1337. The original project was a collaborative effort where PERSEUS-1337 developed the backend and ADMR14 developed the frontend using vanilla HTML, CSS, and JavaScript. This version represents ADMR14's complete modernization of the frontend using React and modern web development practices, while maintaining the core functionality and purpose.

## 🎯 Project Overview

This application presents users with a series of colored numbers and measures their reaction times based on specific rules. It's designed for psychological research and cognitive assessment, featuring both trial and full test modes.

### Key Features

- **Interactive Game Interface**: Clean, responsive UI built with React
- **Dual Test Modes**: Trial (10 iterations) and Full Test (160 iterations)
- **Real-time Data Collection**: Precise reaction time measurement
- **Session Management**: Secure user authentication and data persistence
- **Google Sheets Integration**: Automatic data export for research analysis
- **Structured Data Format**: Organized JSON output for easy analysis

## 🎮 How It Works

### Game Rules
- **Blue Numbers < 5**: Press `Z`
- **Blue Numbers > 5**: Press `X`  
- **Pink Even Numbers**: Press `M`
- **Pink Odd Numbers**: Press `N`

### Test Flow
1. **Login**: User enters email to start session
2. **Instructions**: Clear explanation of game rules
3. **Trial Run**: 10 iterations to familiarize with the interface
4. **Full Test**: 160 iterations for comprehensive data collection
5. **Results**: Immediate feedback with statistics
6. **Data Export**: Results automatically saved to Google Sheets

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **React Router** - Client-side routing
- **CSS Modules** - Component-scoped styling
- **Fetch API** - HTTP client for backend communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Express Session** - Session management
- **Google Sheets API** - Data persistence
- **Body Parser** - Request parsing middleware

### Development Tools
- **Create React App** - Development environment
- **ESLint** - Code linting and formatting
- **Nodemon** - Development server auto-restart

## 📊 Data Structure

The application collects and exports structured data:

```json
{
  "gameType": "full",
  "iterations": 160,
  "results": {
    "correctAnswers": 150,
    "totalAnswers": 160,
    "averageReactionTime": 810,
    "accuracy": 94
  },
  "trials": [
    {
      "iteration": 1,
      "number": 8,
      "color": "Blue",
      "keyPressed": "Z",
      "reactionTime": 917,
      "correct": true
    }
  ]
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Google Cloud Platform account (for Sheets API)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd reaction-time
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create backend/.env file
   SESSION_SECRET=your-session-secret
   GOOGLE_SHEETS_ID=your-spreadsheet-id
   GOOGLE_CREDENTIALS_PATH=path-to-credentials.json
   ```

4. **Build and Run**
   ```bash
   # Build React app
   cd frontend
   npm run build
   
   # Start server
   cd ../backend
   npm start
   ```

5. **Access Application**
   - Open browser to `http://localhost:5000`

## 📁 Project Structure

```
reaction-time/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Game.js    # Main game logic
│   │   │   ├── Login.js   # Authentication
│   │   │   └── ...
│   │   └── App.js         # Main application
│   └── build/            # Production build
└── README.md
```

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

**Backend:**
- `npm start` - Production server
- `npm run dev` - Development with nodemon

### Key Components

- **Game.js**: Core game logic, state management, and data collection
- **Login.js**: User authentication and session management
- **Instructions.js**: Game rules and user guidance
- **End.js**: Results display and logout functionality

## 🎨 Design Features

- **Responsive Design**: Works on desktop and mobile devices
- **Clean UI**: Minimalist interface focused on user experience
- **Visual Feedback**: Color-coded responses and immediate results
- **Progress Tracking**: Clear indication of test completion

## 📈 Performance Considerations

- **Optimized Rendering**: React hooks for efficient state management
- **Memory Management**: Proper cleanup of intervals and event listeners
- **Data Validation**: Input sanitization and error handling
- **Session Security**: Secure session management and authentication

## 🔒 Security Features

- **Session Authentication**: Secure user sessions
- **Route Protection**: Protected API endpoints
- **Input Validation**: Client and server-side validation
- **Environment Variables**: Sensitive data protection

## 🌐 Live Demo

**🔗 [Try the Live Application](https://reaction-time-chi.vercel.app)**

Experience the modernized reaction time test with:
- **Trial Mode**: 10 iterations to practice
- **Full Test**: 160 iterations for comprehensive assessment
- **Real-time Results**: Immediate feedback and statistics
- **Data Export**: Results automatically saved to Google Sheets

## 📝 License

This project is for portfolio demonstration purposes.

## 🤝 Contributing

This is a portfolio project. For questions or feedback, please contact the developer.

## 🙏 Acknowledgments

- **PERSEUS-1337**: Original project creator and backend developer
- **ADMR14**: Frontend developer and project partner - responsible for the complete React modernization

---

**Built with ❤️ using React and Node.js**