const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const http = require('http');
const socketIo = require('socket.io').Server;
const DeviceState = require('./model');

const PROT = 3000;

const app = express();
const server = http.createServer(app);
/**
 * @type {socketIo}
 */
const io = new socketIo(server);

var deviceState = new DeviceState();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/ping', (req, res, next) => {
  res.send('pong');
});

app.post('/now_data', (req, res) => {
  res.json(deviceState);
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

server.listen(PROT, () => {
  console.log(`open port ${PROT}`);
});

io.on('connection', (socket) => {
  socket.on('data', (req) => {
    deviceState.updata(JSON.parse(req));
  });
});
