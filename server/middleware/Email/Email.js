const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail({ to, subject, message, isHtml = false }) {
    if (!to || !subject || !message) {
        throw new Error('Missing email fields: to, subject or message');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const htmlContent = isHtml
        ? `
            <html dir="rtl" lang="he">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            direction: rtl !important;
                            text-align: right !important;
                            font-family: 'Arial', 'Helvetica', 'Noto Sans Hebrew', sans-serif !important;
                            line-height: 1.6;
                            color: #333;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            padding: 20px;
                            background-color: #f9f9f9;
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            box-sizing: border-box;
                        }
                        h1, h3, p, li {
                            direction: rtl !important;
                            text-align: right !important;
                        }
                        ul {
                            padding-right: 20px; 
                        }
                    </style>
                </head>
                <body dir="rtl">
                    <div class="container" dir="rtl">
                        ${message}
                    </div>
                </body>
            </html>
        `
        : null;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        [isHtml ? 'html' : 'text']: isHtml ? htmlContent : message
    };

    await transporter.sendMail(mailOptions);
}

async function sendEmailFromApi(req, res) {
    const { to, subject, message, isHtml = false } = req.body;

    try {
        await sendEmail({ to, subject, message, isHtml });

        res.status(200).json({
            success: true,
            message: 'המייל נשלח בהצלחה!'
        });
    } catch (error) {
        console.error('שגיאה בשליחת המייל:', error.message);
        res.status(500).json({
            success: false,
            message: 'אירעה שגיאה בשליחת המייל.',
            error: error.message
        });
    }
}

async function sendEmailFromServer(to, subject, message, isHtml = false) {
    try {
        await sendEmail({ to, subject, message, isHtml });
        console.log('מייל נשלח בהצלחה ל-' + to);
    } catch (error) {
        console.error('שגיאה בשליחת המייל מהשרת:', error.message);
    }
}

module.exports = {
    sendEmailFromApi,
    sendEmailFromServer
};