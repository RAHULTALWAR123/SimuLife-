import Notification from "../models/notifications.model.js";


export const getNotifications = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch notifications where the user is a direct recipient
        const directNotifications = await Notification.find({ recipient: id })
            .sort({ createdAt: -1 })
            .populate("sender", "_id name username profilePic");

        // Fetch group notifications where the user is in the groupRecipients array
        const groupNotifications = await Notification.find({ groupRecipients: { $in: [id] } })
            .sort({ createdAt: -1 })
            .populate("sender", "_id name username profilePic");

        // Merge and sort both types of notifications
        const allNotifications = [...directNotifications, ...groupNotifications].sort(
            (a, b) => b.createdAt - a.createdAt
        );

        res.status(200).json(allNotifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in notifications", error.message);
    }
};
