const nodemailer = require('nodemailer');
require('dotenv').config();

async function getData(req, res, next) {
    try {
        const { to, subject, message } = req.body;

        if (!to || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'חסרים נתונים בטופס: נמען, נושא או הודעה.'
            });
        }


        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: message
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'המייל נשלח בהצלחה!'
        });
    } catch (error) {
        console.error('שגיאה בשליחת המייל:', error);
        return res.status(500).json({
            success: false,
            message: 'אירעה שגיאה בשליחת המייל.',
            error: error.message
        });
    }
}

module.exports = {
    getData
};