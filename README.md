# Reaction Time Test

[![Deployment](https://img.shields.io/badge/Deployed-Vercel-00C7B7?style=flat&logo=vercel)](https://reaction-time-chi.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat&logo=postgresql)](https://postgresql.org/)

A modern full-stack web application for measuring human reaction times. Built with React frontend and Express.js backend, deployed on Vercel and Render respectively.

> **Note**: This project is a modernization of the original [reaction-time repository](https://github.com/PERSEUS-1337/reaction-time) by PERSEUS-1337. Originally a collaboration between PERSEUS-1337 (backend) and ADMR14 (frontend), this version represents a complete modernization using React and modern deployment practices.

## 🎯 Overview

Interactive cognitive assessment tool that measures reaction times through a color-number association game. Users respond to visual stimuli based on specific rules, and their performance is tracked and analyzed for research purposes.

## 🎮 How It Works

1. **Login** with email address
2. **Trial Run** (10 iterations) to familiarize with the interface
3. **Full Test** (160 iterations) for comprehensive data collection
4. **Results** with detailed statistics and performance metrics

### Response Rules
- **Blue Numbers**: < 5 = Press 'Z', > 5 = Press 'X'
- **Pink Numbers**: Even = Press 'M', Odd = Press 'N'

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, CSS Modules
- **Backend**: Node.js, Express.js v4.17
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Authentication**: Session-based with cookies

## 🌐 Live Demo

**🔗 [Try the Application](https://reaction-time-chi.vercel.app)**

## 📊 Features

- **Real-time Performance Tracking**: Precise reaction time measurement
- **User Authentication**: Secure session-based login system
- **Data Persistence**: PostgreSQL database for research data storage
- **Responsive Design**: Works across desktop and mobile devices
- **Research-Ready**: Export functionality for data analysis
- **Modern Architecture**: Separated frontend/backend deployment

## 🏗️ Architecture

- **Frontend**: React SPA deployed on Vercel
- **Backend**: Express.js API deployed on Render
- **Database**: PostgreSQL hosted on Supabase
- **Communication**: RESTful API with CORS configuration

## 👥 Credits

- **PERSEUS-1337**: Original backend developer and project collaborator
- **ADMR14**: Complete frontend modernization and full-stack deployment

---

*Portfolio project demonstrating modern web development practices including React, Node.js, PostgreSQL integration, and cloud deployment strategies.*