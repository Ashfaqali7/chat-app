import User from "../models/user";
import generateToken from "../utils/generateToken";

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
};

