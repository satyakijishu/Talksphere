import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer"; // For file uploads
import User from "./models/user.model.js";
import { geminiResponse, geminiMultiModalResponse } from "./gemini.js";
import axios from "axios";

dotenv.config();
const app = express();

// ✅ Middlewares
const allowedOrigins = [
  "https://talksphere-silk.vercel.app", // your deployed frontend
  "http://localhost:5173"               // for local dev
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Multer middleware for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Connect Database
connectDb();

// ✅ JWT Authentication Middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

// ✅ Gemini Chat Endpoint (text-only)
// ✅ Gemini Chat Endpoint (text-only)

// app.use("/", (req, res) => {
//     res.send("API is running...");
// })

app.post("/api/chat", async (req, res) => {
    try {
        const prompt = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, message: "Prompt is required" });
        }

        const textResponse = await geminiResponse(prompt.prompt);

        // Parse the Gemini response
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(textResponse);
        } catch (e) {
            return res.status(500).json({ success: false, message: "Invalid JSON response from Gemini." });
        }

        let finalResponse;
        
        // Check for the "tool use" type
        if (parsedResponse.type === "call_api") {
            // Make the API call to your server's endpoint
            const apiResult = await axios.get(`http://localhost:${process.env.PORT || 5000}${parsedResponse.url}`);
            
            if (apiResult.data && apiResult.data.success) {
                finalResponse = apiResult.data.response;
            } else {
                finalResponse = "Sorry, I couldn't get the information you asked for.";
            }
        } else {
            // This is a general response, just use the text from Gemini
            finalResponse = parsedResponse.response;
        }

        res.json({
            success: true,
            response: finalResponse
        });

    } catch (error) {
        console.error("Error in /api/chat route:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
});
// ✅ Endpoint for text + file uploads
app.post("/api/chat-with-file", upload.array("files"), async (req, res) => {
    try {
        const prompt = req.body.prompt || "";
        const files = req.files;

        if (!prompt && (!files || files.length === 0)) {
            return res.status(400).json({ success: false, message: "Prompt or file is required" });
        }

        let imageBase64 = null;
        if (files && files.length > 0) {
            const buffer = files[0].buffer;
            imageBase64 = buffer.toString('base64');
        }

        const textResponse = await geminiMultiModalResponse(prompt, imageBase64);

        // ✅ FIX: Safely parse or extract the response
        let finalResponse = "An unexpected response was received.";
        if (typeof textResponse === "string") {
            try {
                const parsed = JSON.parse(textResponse);
                finalResponse = parsed.response || textResponse;
            } catch {
                finalResponse = textResponse;
            }
        } else if (typeof textResponse === "object" && textResponse.response) {
            finalResponse = textResponse.response;
        }

        res.json({
            success: true,
            response: finalResponse
        });
    } catch (error) {
        console.error("Error in /api/chat-with-file route:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

// ✅ Date API
app.get("/api/date", async (req, res) => {
    try {
        const today = new Date();
        const dateString = today.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        res.json({
            success: true,
            response: `The current date is ${dateString}.`
        });
    } catch (error) {
        console.error("Error fetching date:", error);
        res.status(500).json({ success: false, message: "Failed to get the current date." });
    }
});

// ✅ Mock Google Drive upload
app.post("/api/upload-drive", async (req, res) => {
    try {
        res.json({
            success: true,
            message: "Successfully initiated Google Drive upload (mock)."
        });
    } catch (error) {
        console.error("Error in /api/upload-drive:", error);
        res.status(500).json({ success: false, message: "Failed to connect to Google Drive." });
    }
});

// ✅ Signup
app.post("/signup", async (req, res) => {
    console.log("Signup request body:", req.body);
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User created", user: newUser });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ✅ Signin
app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Signin request body:", req.body);
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true }).json({ message: "Logged in", user });
        res.status(200).json({ message: "Logged in", user });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ✅ Get Current User
app.get("/api/current", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ user });
    } catch (error) {
        console.error("Auth check error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ✅ Set Assistant
app.post("/set-assistant", async (req, res) => {
    try {
        const { assistantName, assistantImage } = req.body;
        if (!assistantName) {
            return res.status(400).json({ success: false, message: "Assistant name is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { assistantName, assistantImage },
            { new: true }
        ).select("-password");

        return res.json({
            success: true,
            message: "Assistant updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating assistant:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

// ✅ Logout
app.post("/logout", (req, res) => {
    res.clearCookie("token").json({ message: "Logged out" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});