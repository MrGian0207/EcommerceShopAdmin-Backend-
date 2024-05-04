import methodOverride from 'method-override';
import express, { Express } from 'express';
import cors from 'cors';
import Route from './routes/index';
import session from 'express-session';
import passport from 'passport';

import ConnectMongoDB from './config/connectionDB';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

//Connect to MongoDB
ConnectMongoDB();

app.use(
  cors({ credentials: true, origin: process.env.REACT_APP_FRONTEND_URL }),
);

app.use(cookieParser());

//When be submitted by form
app.use(express.urlencoded({ extended: false }));

//for fetch, Https, exios when submitted
app.use(express.json({ limit: '50mb' }));

//methodOverride
app.use(methodOverride());

ConnectMongoDB();

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);
app.use(passport.session());

Route(app);

app.listen(8000, () => {
  console.log('Example app listening on port 8000!');
});
