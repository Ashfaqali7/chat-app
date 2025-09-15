import JWT from "jsonwebtoken";
import User from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!req.headers.authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "Server configuration error" });
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized : ", error });
    }
};