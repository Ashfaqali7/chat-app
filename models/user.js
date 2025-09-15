import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, minlength: 6 },
        avatar: { type: String, default: "" },
        status: { type: String, enum: ["online", "offline", "away"], default: "offline" },
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

userSchema.pre("save", async (next) => {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (typedPassword) {
    return await bcrypt.compare(typedPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;