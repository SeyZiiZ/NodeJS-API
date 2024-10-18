import dotenv from 'dotenv'
import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.set('trust proxy', true);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api', (req, res) => {
    const date = new Date();
    const currentDateUtc = date.toUTCString();
    const unixDate = date.getTime();
    res.json({
        unix: unixDate,
        utc: currentDateUtc
    });
});

app.get('/api/:param', (req, res) => {
  const userParam = req.params.param;
  if (userParam.includes('-')) {

      const date = new Date(userParam);

      if (date.toString() === 'Invalid Date') {
        res.json({error: "Invalid Date"});
      } else {
        const correctDate = date.toUTCString();
        const unixDate = Date.parse(correctDate);
        res.json({
            unix: unixDate,
            utc: correctDate 
        });
      } 
  } else {
      const inted = parseInt(userParam);
      const date = new Date(inted);
      const correctDate = date.toUTCString();
      res.json({
          unix: inted,
          utc: correctDate
      });

  }
});

app.listen(port, () => {
    console.log(`connecté sur le port : ${port}`);
});
