import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import debug from 'debug';
import express from 'express';
import logger from 'morgan';
import path from 'path';
// import favicon from 'serve-favicon';

import cors from 'cors'
import index from './routes/index';
// import session from 'express-session'
import mongoose from 'mongoose'
import {usedDatabase} from './config/database'
const functions = require("firebase-functions")

const USED_DATABASE = usedDatabase

const app = express();
// const debug = Debug('techberry-bot:app');
app.set('views', path.join(__dirname, 'views'));
// view engine setup
app.set('view engine', 'pug');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors())


mongoose.connect(USED_DATABASE,{useNewUrlParser:true})
const db = mongoose.connection

db.on('error',console.error.bind(console,'Connection Error: '))
db.once('open',()=>{
  console.log("Database Connected: ", USED_DATABASE)
})

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'tea-admin')));

app.use('/', index);


app.get("/*",(req,res,next)=>{
  res.sendFile(path.resolve(__dirname,"public","index.html"))
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  console.log("Error: ",err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  console.log(err)
  debug('Caught exception: %j', err);
  process.exit(1);
});

export default app;

