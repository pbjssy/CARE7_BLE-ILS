import express from 'express';
import twilio from 'twilio';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin: '*'
}));
app.use(express.json());

// API endpoint to send SMS
app.post('/send-sms', async (req, res) => {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const { messageBody } = req.body;
    const toNumber = process.env.TO_NUMBER;
    const fromNumber = process.env.FROM_NUMBER;

    try {
        console.log('Sending message to:', toNumber);
        console.log('Message body:', messageBody);
        const message = await client.messages.create({
            body: messageBody,
            from: fromNumber,
            to: toNumber
        });
        console.log('Message sent successfully:', message.sid);
        res.status(200).send({ sid: message.sid, status: 'Message sent' });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).send({ error: err.message, status: 'Message not sent' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
