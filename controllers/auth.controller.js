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

