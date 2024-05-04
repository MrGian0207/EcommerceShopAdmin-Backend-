import methodOverride from 'method-override';
import express, { Express } from 'express';
import cors from 'cors';
import Route from './routes/index';
import ConnectMongoDB from './config/connectionDB';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

//Connect to MongoDB
ConnectMongoDB();

app.use(
  cors({
    credentials: true,
    origin: process.env.REACT_APP_FRONTEND_URL,
    exposedHeaders: 'content-length',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Accept-Encoding',
      'Accept-Language',
      'Host',
      'Referer',
      'User-Agent',
      'X-CSRF-Token',
    ],
    optionsSuccessStatus: 204,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  }),
);

app.use(cookieParser());

//When be submitted by form
app.use(express.urlencoded({ extended: false }));

//for fetch, Https, exios when submitted
app.use(express.json({ limit: '50mb' }));

//methodOverride
app.use(methodOverride());

ConnectMongoDB();

Route(app);

app.listen(8000, () => {
  console.log('Example app listening on port 8000!');
});
