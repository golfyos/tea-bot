import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import debug from 'debug';
import express from 'express';
import logger from 'morgan';
import path from 'path';

import cors from 'cors'
import index from './routes/index';
import mongoose from 'mongoose'
import config from './config/config.json'

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors())

mongoose.connect(config.db.cloud, { useNewUrlParser:true })
const db = mongoose.connection

db.on('error',console.error.bind(console,'Connection Error: '))
db.once('open', () => {
  console.log("Database Connected: ", config.db.cloud)
})

app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'tea-admin')));

app.use(express.static(path.join(__dirname, 'public')));
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

