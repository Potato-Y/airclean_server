const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const http = require('http');
const socketIo = require('socket.io').Server;
const DeviceState = require('./model');
const bcrypt = require('bcrypt');

const PROT = 3000;

const app = express();
const server = http.createServer(app);
/**
 * @type {socketIo}
 */
const io = new socketIo(server);

const PW = 'abcd1234';

const authCheck = (pw) => {
  const encryptedPW = bcrypt.hashSync(pw, 10);
  return bcrypt.compareSync(PW, encryptedPW);
};

var deviceState = new DeviceState();
deviceState.updata(JSON.parse('{"state":true,"mode":"1","windSpeed":1,"uv":true,"humidifier":false,"petier":false,"temperature":"20.2","humidity":40,"dust":{"1.0":13,"2.5":15,"10.0":20},"gas":1}'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/ping', (req, res, next) => {
  res.send('pong');
});

app.post('/auth_check', (req, res) => {
  if (!authCheck(req.body.pw)) {
    return res.status(400).json({
      errors: [
        {
          message: 'Not password',
        },
      ],
    });
  }

  res.status(200).json({ result: true });
});

app.post('/now_device_state', (req, res) => {
  if (!authCheck(req.body.pw)) {
    return res.status(400).json({
      errors: [
        {
          message: 'Not password',
        },
      ],
    });
  }

  res.status(200).json(deviceState);
});

app.post('/mode_change', (req, res) => {
  if (!authCheck(req.body.pw)) {
    return res.json({ error: 'pw error' });
  }

  console.log(req.body);

  try {
    io.sockets.sockets.forEach((aSocket) => {
      aSocket.send('mode_change', JSON.parse({ mode: req.body.mode, humidityMode: req.body.humidityMode }));
    });
  } catch (error) {
    console.error(error);
  }
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
  socket.on('disconnect', () => {
    deviceState = new DeviceState();
  });
});
