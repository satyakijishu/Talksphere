import User from "../models/user.model.js"
import { getUserFromDatabase } from "../services/userService.js"; // Assuming you have a service to fetch user data
export const getCurrentUser = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ message: "Unauthorized" });
    }
    // Fetch user from database
    const user = getUserFromDatabase(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
};