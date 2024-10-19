import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { error } from 'console';

dotenv.config();
const app = express();
const storage = multer.memoryStorage();
app.set('trust proxy', true);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.dotenv ||8000;

const upload = multer({storage: storage});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/html', 'index.html'));
});

app.post('/api/fileanalyse', upload.single('fileToUpload'), (req, res) => {

    if (!req.file) {
        res.json({error: 'No file uploaded'});
    }

    const fileInfo = {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size
    }

    res.json(fileInfo);
    
});

app.listen(port, (req, res) => {
    console.log(`Server on port : ${port}`);
});