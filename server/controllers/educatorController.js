import { clerkClient } from "@clerk/express";

export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;

        await clerkClient.user.updateUserMetadata(userId, {
            publicmetadata: {
                role: "educator"
            }
        });
        res.json({ success: true, message: "You can publish a course now" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}