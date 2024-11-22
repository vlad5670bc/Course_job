import express from 'express';
import mongoose from 'mongoose';
import router from './Router.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:27017/${DB_NAME}?authSource=admin`;

const app = express();

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: DB_URL}),
    cookie: {secure: false}
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

app.use('/api', router);

async function startApp() {
    try {
        await mongoose.connect(DB_URL);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.error('Error connecting to MongoDB:', e);
    }
}

startApp();

export default DB_URL