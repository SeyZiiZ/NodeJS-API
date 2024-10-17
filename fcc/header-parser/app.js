import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.set('trust proxy', true);

const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res, err) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/whoami', (req, res) => {
    const userIp = req.headers['x-forwarded-for'] || req.ip;
    const userLanguage = req.headers['accept-language'];
    const userAgent = req.headers['user-agent'];
    const userAccept = req.headers.accept;
    const userReferer = req.headers.referer;
    res.send({
            ipaddress: userIp,
            language: userLanguage, 
            software: userAgent,
            accept: userAccept,
            referer: userReferer
        });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});