async function addNotification(userId, role, title, message, type, projectId = null) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO notifications (user_id, role, title, message, type, project_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db_pool.query(query, [userId, role, title, message, type, projectId], (err, result) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

module.exports = { addNotification };
