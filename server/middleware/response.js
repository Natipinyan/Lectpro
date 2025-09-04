function sendResponse(res) {
    try {
        res.status(res.getStatus || 200).json({
            success: res.getStatus,
            data: res.data || [],
            message: res.getMessage || null
        });
    } catch (err) {
        console.error("Response error:", err);
        res.status(res.getStatus || 500).json({
            success: false,
            data: res.data || [],
            message: res.getMessage || "שגיאה פנימית"
        });
    }
}

module.exports = { sendResponse };
