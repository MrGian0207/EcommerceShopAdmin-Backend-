import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express } from 'express'
import methodOverride from 'method-override'

import ConnectMongoDB from './config/connectionDB'
import Route from './routes/index'

dotenv.config()

const app: Express = express()

//Connect to MongoDB
ConnectMongoDB()

app.use(
  cors({
    credentials: true,
    origin: [`${process.env.REACT_APP_FRONTEND_URL}`, `${process.env.REACT_APP_FRONTEND_URL_DEV}`],
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
    methods: 'GET,POST,HEAD,PUT,PATCH,DELETE',
    preflightContinue: false,
  })
)

app.use(cookieParser())

//When be submitted by form
app.use(express.urlencoded({ extended: false }))

//for fetch, Https, axios when submitted
app.use(express.json({ limit: '50mb' }))

//methodOverride
app.use(methodOverride())

Route(app)

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
})
