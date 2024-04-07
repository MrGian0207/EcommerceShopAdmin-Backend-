import methodOverride from 'method-override';
import express, { Express } from 'express';
import cors from 'cors';
import Route from './routes/index';

import ConnectMongoDB from './config/connectionDB';
import cookieParser from 'cookie-parser';

const app: Express = express();

//Connect to MongoDB
ConnectMongoDB();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(cookieParser());

//When be submitted by form
app.use(express.urlencoded({ extended: false }));

//for fetch, Https, exios when submitted
app.use(express.json({ limit: '50mb' }));

//methodOverride
app.use(methodOverride('_method'));

ConnectMongoDB();

Route(app);

app.listen(8000, () => {
    console.log('Example app listening on port 8000!');
});
