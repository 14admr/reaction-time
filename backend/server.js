const express = require("express");
const session = require("express-session");
const {google} = require("googleapis");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
require("dotenv").config();

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
        console.log(req.session.emailStored);
        res.send("No Authentication, need to login in to work!");
    }
}

express()
    .use(bodyParser.urlencoded({ extended: true }))
    .use(logger)
    .use(express.json())
    .use(session({

        secret: process.env.SESSION_SECRET || 'REACTION TIME',
        resave: false,
        saveUninitialized: true

    }))
    // Serve static files from the React app build directory
    .use(express.static(frontendBuildPath))
    
    // API Routes
    .post("/api/login", (req, res) => {
        req.session.emailStored = req.body.user.email;
        console.log("Email is: (session)"+ req.session.emailStored);
        res.json({ success: true, redirectTo: "/instructions" });
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
        res.json({ authenticated: !!req.session.emailStored, email: req.session.emailStored || null });
    })
    
    // Protected API routes (require authentication)
    .post("/api/game", auth, async (req, res) => {

        const { data } = req.body;

        let dateObj = new Date();
        let date = ("0" + dateObj.getDate()).slice(-2);
        let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
        let year = dateObj.getFullYear();
        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();
        let seconds = dateObj.getSeconds();
        req.session.sessionDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        // Google Sheets API configuration
        const auth = new google.auth.GoogleAuth({
            keyFile: process.env.GOOGLE_CREDENTIALS_PATH || "google-credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
    
        // Create client instance for auth
        const client = await auth.getClient();
    
        // Instance of Google Sheets API
        const googleSheets = google.sheets({ version: "v4", auth: client });
    
        const spreadsheetId = process.env.GOOGLE_SHEETS_ID || "18jCkI5Ut3VaO8jG7unzilpDdtB8zlnLjLtLvTqy2-io";
    
        // Prepare structured data for spreadsheet
        let dataArray = [
            req.session.sessionDate,
            req.session.emailStored,
            data.gameType,
            data.iterations,
            data.results.correctAnswers,
            data.results.totalAnswers,
            data.results.averageReactionTime,
            data.results.accuracy
        ];

        // Add trial data (flattened for spreadsheet compatibility)
        data.trials.forEach(trial => {
            dataArray.push(
                trial.iteration,
                trial.number,
                trial.color,
                trial.keyPressed,
                trial.reactionTime,
                trial.correct ? 1 : 0
            );
        });

        req.session.dataArray = dataArray;

        // Write row(s) to spreadsheet
        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Sheet1",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    dataArray,
                ],
            },
        });

        console.log("Successfully Submitted Email: "+req.session.emailStored);
        res.json({ success: true, redirectTo: "/end" });
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));