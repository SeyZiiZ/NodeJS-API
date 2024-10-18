import { error } from 'console';
import dotenv from 'dotenv';
import express from 'express';
import { get } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.set('trust proxy', true);
app.use(express.urlencoded({extended: true}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;

let urls = [];
let urlCounter = 1;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/shorturl', (req, res) => {
    const url = req.body.urlPost;
    const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/[a-zA-Z0-9#-]+)*\/?$/;
    if (urlPattern.test(url)) {
        const params = {original_url: url, short_url: urlCounter};
        urls.push(params);
        urlCounter += 1;
        res.json(params);
    } else {
        res.json({error: 'invalid url'});
    }
});

app.get('/api/shorturl/list', (req, res) => {
    res.send(urls);
});

app.get('/api/shorturl/:id', (req, res) => {
    const idParams = parseInt(req.params.id);
    const getLink = [...urls].filter((element) => element.short_url === idParams);

    if (getLink.length > 0) {
        const pathToSite = getLink[0].original_url;
        res.redirect(pathToSite);
    } else {
        res.json({error: "No short URL found for the given input"});
    }
});

app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});
