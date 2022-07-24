import express from "express";
import cors from 'cors';
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
app.use(express.json());

app.use(
  session({
    secret: SECRET!,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', loginRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/users', usersRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
};

start();
