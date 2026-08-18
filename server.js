const express = require("express");
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();

// ===============================
// Middleware
// ===============================

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===============================
// Folders
// ===============================

const registrationFolder = path.join(
    __dirname,
    "registrations"
);

const uploadFolder = path.join(
    __dirname,
    "uploads"
);

if (!fs.existsSync(registrationFolder)) {
    fs.mkdirSync(registrationFolder);
}

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// ===============================
// Multer Setup
// ===============================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            file.originalname;

        cb(pplication/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF, DOC and DOCX files are allowed!"));
        }
    }
});

// ===============================
// MySQL
// ==============================

require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log("MySQL connection failed:", err);
        return;
    }

    console.log("MySQL connected successfully!");
});
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "a
});

// ===============================
// Register
// ===============================

app.post(
    "/register",
    upload.single("resume"),
    (req, res) => {

        const {
            name,
            age,
            date_of_birth,
            address,
            gender,
            email,
            course
        } = req.body;

        // Uploaded resume information

        let resumeFile = "";

        if (req.file) {
            resumeFile = req.file.filename;
        }

        // ===============================
        // Save to MySQL
        // ===============================

        const sql = `
            INSERT INTO registrations
            (
                name,
                age,
                date_of_birth,
                address,
                gender,
                email,
                course,
                resume
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                name,
                age,
                date_of_birth,
                address,
                gender,
                email,
                course,
                resumeFile
            ],
            (err, result) => {

                if (err) {

                    console.log(
                        "MySQL Error:",
                        err
                    );

                    return res.status(500).send(
                        "Registration failed"
                    );
                }

                const registrationId =
                    result.insertId;

                console.log(
                    "Saved to MySQL!"
                );

                // ===============================
                // Create HTML
                // ===============================

                const resumeLink =
                    resumeFile
                        ? `<a href="/uploads/${resumeFile}" target="_blank">
                            View Resume
                           </a>`
                        : "No resume uploaded";

                const htmlContent = `
<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <title>
        Registration ${registrationId}
    </title>

    <style>

        body {
            font-family: Arial;
            background: #f2f2f2;
            padding: 40px;
        }

        .container {
            width: 600px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px #ccc;
        }

        h1 {
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        td {
            padding: 12px;
            border: 1px solid #ddd;
        }

        td:first-child {
            font-weight: bold;
            background: #f5f5f5;
            width: 35%;
        }

    </style>

</head>

<body>

<div class="container">

    <h1>Registration Details</h1>

    <table>

        <tr>
            <td>Registration ID</td>
            <td>${registrationId}</td>
        </tr>

        <tr>
            <td>Name</td>
            <td>${name}</td>
        </tr>

        <tr>
            <td>Age</td>
            <td>${age}</td>
        </tr>

        <tr>
            <td>Date of Birth</td>
            <td>${date_of_birth}</td>
        </tr>

        <tr>
            <td>Address</td>
            <td>${address}</td>
        </tr>

        <tr>
            <td>Gender</td>
            <td>${gender}</td>
        </tr>

        <tr>
            <td>Email</td>
            <td>${email}</td>
        </tr>

        <tr>
            <td>Course</td>
            <td>${course}</td>
        </tr>

        <tr>
            <td>Resume</td>
            <td>${resumeLink}</td>
        </tr>

    </table>

</div>

</body>

</html>
`;

                // ===============================
                // Save HTML file
                // ===============================

                const fileName =
                    `registration_${registrationId}.html`;

                const filePath =
                    path.join(
                        registrationFolder,
                        fileName
                    );

                fs.writeFile(
                    filePath,
                    htmlContent,
                    "utf8",
                    (fileError) => {

                        if (fileError) {

                            console.log(
                                "HTML file error:",
                                fileError
                            );

                            return res.status(500).send(
                                "Data saved, but HTML file failed."
                            );
                        }

                        console.log(
                            "HTML file saved!"
                        );

                        res.send(`
                            <h2>
                                Registration Successful!
                            </h2>

                            <p>
                                Registration ID:
                                ${registrationId}
                            </p>

                            <p>
                                Your data and resume
                                have been saved.
                            </p>

                            <a href="/">
                                Back to Form
                            </a>
                        `);
                    }
                );
            }
        );
    }
);

// ===============================
// Home
// ===============================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "index.html"
        )
    );

});

// ===============================
// Start Server
// ===============================
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});


});