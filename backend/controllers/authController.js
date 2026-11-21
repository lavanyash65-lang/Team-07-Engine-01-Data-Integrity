
const User = require("../models/ User");
const Organization = require("../models/Organization");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================
// INDIVIDUAL REGISTRATION
// =====================================

const registerIndividual = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Individual account already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        res.status(201).json({
            message: "Individual registered successfully",
            userId: newUser._id
        });

    } catch (error) {
        console.error("Individual Registration Error:", error.message);

        res.status(500).json({
            message: "Server error during individual registration"
        });
    }
};


// =====================================
// ORGANIZATION REGISTRATION
// =====================================

const registerOrganization = async (req, res) => {
    try {
        const { organizationName, industry, email, password } = req.body;

        if (!organizationName || !industry || !email || !password) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters"
            });
        }

        const existingOrganization = await Organization.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingOrganization) {
            return res.status(409).json({
                message: "Organization account already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newOrganization = await Organization.create({
            organizationName,
            industry,
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        res.status(201).json({
            message: "Organization registered successfully",
            organizationId: newOrganization._id
        });

    } catch (error) {
        console.error("Organization Registration Error:", error.message);

        res.status(500).json({
            message: "Server error during organization registration"
        });
    }
};


// =====================================
// LOGIN
// =====================================

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Please provide email, password and role"
            });
        }

        let account;

        if (role === "individual") {
            account = await User.findOne({
                email: email.toLowerCase().trim()
            });

        } else if (role === "organization") {
            account = await Organization.findOne({
                email: email.toLowerCase().trim()
            });

        } else {
            return res.status(400).json({
                message: "Invalid account role"
            });
        }

        if (!account) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            account.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in .env");
        }

        const token = jwt.sign(
            {
                id: account._id,
                role: role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            role
        });

    } catch (error) {
        console.error("Login Error:", error.message);

        res.status(500).json({
            message: "Server error during login"
        });
    }
};


// =====================================
// EXPORT ALL FUNCTIONS
// =====================================

module.exports = {
    registerIndividual,
    registerOrganization,
    login
};
