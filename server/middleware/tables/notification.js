async function getNotifications(req, res, next) {
    try {
        const userId = req.user.id;
        const role = req.user.role;


        const [notifications] = await db_pool.promise().query(
            `SELECT id, title, message, type, project_id, is_read, created_at
             FROM notifications
             WHERE user_id = ? AND role = ?
             ORDER BY created_at DESC`,
            [userId, role]
        );

        res.locals.data = { success: true, data: notifications };
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'שגיאה בקבלת ההתראות' });
    }
}

module.exports = { getNotifications };