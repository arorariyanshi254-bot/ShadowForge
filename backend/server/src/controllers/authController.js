import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "shadowforge_secret_key_2026_secure", {
        expiresIn: "30d",
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "An account with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                },
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.password) {
            return res.status(400).json({ message: "Please sign in using Google" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate with Google OAuth
// @route   POST /api/auth/google
export const googleAuth = async (req, res) => {
    try {
        const { credential, name, email, picture, sub } = req.body;
        
        let googleEmail = email;
        let googleName = name;
        let googlePicture = picture || "";
        let googleSub = sub;

        // If JWT credential string provided by Google OAuth button
        if (credential) {
            try {
                // Decode token directly or verify with Google client
                const decoded = jwt.decode(credential);
                if (decoded) {
                    googleEmail = decoded.email || googleEmail;
                    googleName = decoded.name || googleName;
                    googlePicture = decoded.picture || googlePicture;
                    googleSub = decoded.sub || googleSub;
                }
            } catch (err) {
                console.warn("Google credential decode fallback:", err.message);
            }
        }

        if (!googleEmail) {
            return res.status(400).json({ message: "Google authentication failed: Email not provided" });
        }

        let user = await User.findOne({ email: googleEmail });

        if (user) {
            // Update user with googleId or picture if missing
            if (!user.googleId) user.googleId = googleSub;
            if (!user.picture && googlePicture) user.picture = googlePicture;
            await user.save();
        } else {
            // Create user
            user = await User.create({
                name: googleName || googleEmail.split("@")[0],
                email: googleEmail,
                googleId: googleSub,
                picture: googlePicture,
            });
        }

        res.json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
            },
        });
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
