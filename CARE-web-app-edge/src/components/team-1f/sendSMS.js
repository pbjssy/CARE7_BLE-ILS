import express from 'express';
import twilio from 'twilio';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

async function sendSMS() {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    try {
        const message = await client.messages.create({
            body: 'The individual has left the room.',
            from: '+12515122076',
            to: process.env.TO_NUMBER
        });
        console.log(message.sid, 'Message sent');
    } catch (err) {
        console.error(err, 'Message not sent');
    }
}

sendSMS();

app.listen(5000, () => console.log('Listening at port 5000'));
