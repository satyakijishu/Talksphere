import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    assistantName: {
        type: String,
        default: null
    },
    assistantImage: {
        type: String,
        default: null
    },
    history: [
        { type: String }
    ]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
