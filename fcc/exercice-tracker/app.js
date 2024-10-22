import dotenv from 'dotenv';
import express from 'express';
import path from'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { error, info } from 'console';
import { Types } from 'mongoose';

dotenv.config();
const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to mongoodb'))
.catch((err) => console.log(`Problem connecting to mongoo ${err}`));

const userSchema = new mongoose.Schema({
    username : String
});

let User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views', 'index.html'));
});

const postUser = async (username) => {
    try {
        let data = await User.create({username});
        console.log(`User created : ${data.username}, id : ${data._id}`);
        return data;
    } catch(err) {
        console.log(`Error creating user : ${username}`);
        throw err;
    }
}

app.post('/api/users', async (req, res) => {
    const data = req.body.userName;
    try {
        let user = await postUser(data);
        res.status(201).send({username: user.username, id: user.id})
    } catch (err) {
        res.status(500).send({error: `Error creating user` + err});
    }
});

app.get('/api/users', async (req, res) => {
    try {
        let users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send({error: 'Error getting list users'});
    }
});

const exercisesSchema = new mongoose.Schema({
    id: String,
    username: String,
    date: String,
    duration: Number,
    description: String
});

const Exercises = mongoose.model('Exercises', exercisesSchema);

const addExercises = async (id, username, date, duration, description) => {
    try {
        let exercice = await Exercises.create({
            id: id,
            username: username,
            date: date,
            duration: duration,
            description: description
        });
        console.log(`Exercice added with succes !`);
        return exercice;
    } catch (err) {
        console.log(`Error adding exercice function`, err);
        throw err;
    }
}

app.post('/api/users/:id/exercises', async (req, res) => {
    const {idUser, description, duration, date } = req.body;
    try {
        const user = await User.findOne({ _id: new Types.ObjectId(idUser) });

        if (!user) {
            return res.status(404).send({ message: 'No user with this id' });
        }

        try {
            const data = await addExercises(idUser, user.username, date, duration, description);
            const { _id, __v, ...exerciseData } = data._doc;
            res.status(200).send(exerciseData);
        } catch (err) {
            res.status(500).send({ error: 'Error adding exercise post' });
        }
    } catch (err) {
        res.status(500).send({ error: err.message, information: 'Error trying to get user' });
    }
});


app.get('/api/users/:id/exercises', async (req, res) => {
    const idUser = req.params.id;

    try {
        let data = await Exercises.find({id: idUser});
        res.json({exercices: data});
    } catch (err) {
        res.json({error: err, information: 'Error getting exercices'})
    }
});

app.listen(port, () => {
    console.log(`Server listening on por : ${port}`);
});