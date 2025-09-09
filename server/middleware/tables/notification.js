async function getNotifications(req, res, next) {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let query = `
            SELECT id, title, message, type, project_id, is_read, created_at
            FROM notifications
            WHERE user_id = ?
        `;
        let params = [userId];

        if (role === 'student') {
            query += ` AND role = ?`;
            params.push('student');
        } else if (role === 'instructor') {
            query += ` AND role IN (?, ?)`;
            params.push('instructor', 'admin');
        }

        query += ` ORDER BY created_at DESC`;

        const [notifications] = await db_pool.promise().query(query, params);
        const notificationIds = notifications.map(n => n.id);
        if (notificationIds.length > 0) {
            const updateQuery = `
                UPDATE notifications
                SET is_read = 1
                WHERE id IN (?)
            `;
            await db_pool.promise().query(updateQuery, [notificationIds]);
        }

        res.locals.data = { success: true, data: notifications };
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'שגיאה בקבלת ההתראות' });
    }
}

module.exports = { getNotifications };