const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const http = require('http');
const webSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new webSocket.Server({ server });

app.use(logger('dev'));
app.use(express.json());

app.get('/', (req, res, next) => {
  res.send('express');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(3000);
