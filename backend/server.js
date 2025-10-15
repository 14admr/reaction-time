const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');
const cors = require('cors');
const { initializeDatabase, db, testConnection } = require("./database");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

// Trust proxy for HTTPS detection on Render (will be applied to app instance)


// paths constants, to reduce typos
const path = require("path");
const frontendBuildPath = path.join(__dirname, '../frontend/build');

// middleware functions
function logger(req, res, next) {
    console.log(">Log");
    next();
}

function auth(req, res, next) {
    console.log(">Auth");
    if (req.session.emailStored) {
        next();
    } else {
        console.log("❌ Auth failed - no session");
        res.status(401).json({ error: "Authentication required" });
    }
}

express()
    .set('trust proxy', 1) // Trust proxy for HTTPS detection on Render
    .use(express.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cors({
        origin: ['https://reaction-time-chi.vercel.app', 'http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
    }))
    .use(session({
        secret: process.env.SESSION_SECRET || 'REACTION TIME',
        resave: true, // Force save session on every request
        saveUninitialized: true, // Save uninitialized sessions
        cookie: {
            secure: true, // Required for sameSite: 'none' and HTTPS
            httpOnly: true, // Secure cookie
            maxAge: 60 * 60 * 1000, // 1 hour
            sameSite: 'none', // Required for cross-origin
            domain: undefined // Let browser determine domain
        },
        name: 'sessionId' // Custom session name
    }))
    .use(logger)
    
    // Ensure CORS headers on all responses
    .use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', req.headers.origin || 'https://reaction-time-chi.vercel.app');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    })
    
    // Handle CORS preflight requests explicitly
    .options('*', (req, res) => {
        console.log('🔍 OPTIONS preflight request:', req.path);
        res.header('Access-Control-Allow-Origin', req.headers.origin || 'https://reaction-time-chi.vercel.app');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.sendStatus(200);
    })
    
    // Serve static files from the React app build directory
    .use(express.static(frontendBuildPath))
    
    // Health check endpoint
    .get("/api/health", (req, res) => {
        res.json({ status: "OK", timestamp: new Date().toISOString() });
    })
    
    
    // API Routes
    .post("/api/login", (req, res) => {
        try {
            req.session.emailStored = req.body.user.email;
            console.log("Email is: (session)"+ req.session.emailStored);
            res.json({ success: true, redirectTo: "/instructions" });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ success: false, error: "Login failed" });
        }
    })
    
    .post("/api/logout", (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log("Error destroying session:", err);
                res.json({ success: false });
            } else {
                console.log("Session destroyed successfully");
                res.json({ success: true, redirectTo: "/" });
            }
        });
    })
    
    .get("/api/auth-status", (req, res) => {
        try {
            res.json({ authenticated: !!req.session.emailStored, email: req.session.emailStored || null });
        } catch (error) {
            console.error("Auth status error:", error);
            res.status(500).json({ authenticated: false, email: null });
        }
    })
    
    // Protected API routes (require authentication)
    .post("/api/game", auth, async (req, res) => {
        try {
            const { data } = req.body;
            const email = req.session.emailStored;

            // Create or get participant
            const participantId = await db.createParticipant(email);

            // Create game session
            const sessionId = await db.createGameSession(participantId, data);

            // Create individual trials
            await db.createTrials(sessionId, data.trials);

            console.log(`✅ Successfully saved game data for ${email} (Session ID: ${sessionId})`);
            res.json({ success: true, redirectTo: "/end" });

        } catch (error) {
            console.error("❌ Error saving game data:", error);
            res.status(500).json({ 
                success: false, 
                error: "Failed to save game data" 
            });
        }
    })

    // API endpoint for researchers to download data
    .get("/api/export-data", auth, async (req, res) => {
        try {
            const data = await db.getAllData();
            
            // Convert to CSV format for easy analysis
            const csvHeaders = [
                'Participant Email', 'Participant Created', 'Game Type', 'Session ID',
                'Total Iterations', 'Correct Answers', 'Average Reaction Time', 'Accuracy %',
                'Session Created', 'Iteration', 'Number Shown', 'Color Shown',
                'Key Pressed', 'Reaction Time (ms)', 'Is Correct'
            ];
            
            const csvRows = data.map(row => [
                row.email,
                row.participant_created,
                row.game_type,
                row.session_id,
                row.total_iterations,
                row.correct_answers,
                row.average_reaction_time,
                row.accuracy_percentage,
                row.session_created,
                row.iteration_number,
                row.number_shown,
                row.color_shown,
                row.key_pressed,
                row.reaction_time,
                row.is_correct
            ]);

            const csvContent = [csvHeaders, ...csvRows]
                .map(row => row.map(cell => `"${cell}"`).join(','))
                .join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="reaction_time_data.csv"');
            res.send(csvContent);

        } catch (error) {
            console.error("❌ Error exporting data:", error);
            res.status(500).json({ error: "Failed to export data" });
        }
    })
    .listen(PORT, async () => {
        console.log(`🚀 Server listening on port ${PORT}`);
        
        // Initialize database in background to prevent blocking startup
        setTimeout(async () => {
            try {
                await initializeDatabase();
                console.log(`✅ Database initialization completed`);
            } catch (error) {
                console.error(`❌ Database initialization failed:`, error);
            }
        }, 1000);
    });