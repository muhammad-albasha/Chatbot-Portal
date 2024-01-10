import express from 'express';
import https from 'https';
import authMiddleware from '../routes/authMiddleware.js';

const router = express.Router();

router.post('/api/chatbot/redirect', authMiddleware, (req, res) => {
    const data = JSON.stringify(req.body);

    const options = {
        hostname: 'localhost',
        port: 5005,
        path: '/webhooks/rest/webhook',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        },
        rejectUnauthorized: false
    };

    const apiReq = https.request(options, (apiRes) => {
        let responseData = '';

        apiRes.on('data', (chunk) => {
            responseData += chunk;
        });

        apiRes.on('end', () => {
            try {
                res.status(apiRes.statusCode).json(JSON.parse(responseData));
            } catch (error) {
                console.error('Fehler beim Parsen der Antwort von Rasa:', error);
                res.status(500).send('Fehler beim Parsen der Antwort von Rasa');
            }
        });
    });

    apiReq.on('error', (error) => {
        console.error('Fehler bei der Anfrage an Rasa:', error);
        res.status(500).send('Fehler bei der Anfrage an Rasa');
    });

    apiReq.write(data);
    apiReq.end();
});

export default router;
