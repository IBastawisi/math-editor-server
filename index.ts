import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import session from 'express-session';
import passport from 'passport';

import { connectToDatabase } from './config/db';
import './passport';

import loginRouter from './controllers/auth';
import documentsRouter from './controllers/document';
import usersRouter from './controllers/user';

import errorHandler from './middlewares/errorHandler';

import { PORT, SECRET, FRONTEND_URL } from './config/env';

const app = express();

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());

// trust proxy (https://stackoverflow.com/questions/64958647/express-not-sending-cross-domain-cookies)
app.set("trust proxy", 1);

app.use(
  session({
    secret: SECRET!,
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', loginRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/users', usersRouter);

app.get('*', (req, res) => {
  res.send(`<a href="${FRONTEND_URL}">Math Editor</a> API Server`);
})

app.use(errorHandler);

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
};

start();
