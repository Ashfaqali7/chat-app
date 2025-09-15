import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {

    try {
        const { name, email, password, avatar } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400);
            throw new Error("User already exists");
        }
        const user = await User.create({
            name,
            email,
            password,
            avatar,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const logOutUser = async (req, res) => {
    res.cookie("jwt", "", { expires: new Date(0) });
    return res.json({ message: "Logged out" });
};

export const listUsers = async (req, res) => {
    try {
        const search = req.query.search?.trim();
        const query = search
            ? {
                $and: [
                    { _id: { $ne: req.user._id } },
                    {
                        $or: [
                            { name: { $regex: search, $options: "i" } },
                            { email: { $regex: search, $options: "i" } }
                        ]
                    }
                ]
            }
            : { _id: { $ne: req.user._id } };

        const users = await User.find(query).select("name email avatar status");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user is trying to add themselves
        if (email === req.user.email) {
            res.status(400);
            throw new Error("You cannot add yourself");
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If user exists, return the existing user
            return res.json(existingUser);
        }
        
        // Create a placeholder user with a random password
        const placeholderPassword = Math.random().toString(36).slice(-8);
        const newUser = await User.create({
            name: email.split("@")[0], // Use email username as name
            email: email,
            password: placeholderPassword // This will be hashed by the pre-save hook
        });
        
        // Return the user without the password
        const userWithoutPassword = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            status: newUser.status
        };
        
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};