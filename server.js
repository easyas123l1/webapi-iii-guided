const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// middleware

// custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`)
  next();//allow the request to continue to the next middle/route handler
}

function gatekeeper(req, res, next) {
  console.log(req.headers.password)
  if (req.headers.password === 'mellon') {
    next()
  } 
  res.status(401).json({ errorMessage: 'error wrong password! '})
}

// write a gatekeeper middleware that reads a password from the headers and if the password is 'mellon', let it continue
// if not, send back status code 401 and a message

server.use(helmet());
server.use(express.json());
server.use(logger);
server.use(gatekeeper);

server.use('/api/hubs', helmet(), hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get('/echo/', (req, res) => {
  res.send(req.headers);
})

module.exports = server;
