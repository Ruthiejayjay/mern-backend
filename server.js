const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const server = express();

server.use(bodyParser.json());

server.use('/uploads/images', express.static(path.join('uploads', 'images')))

server.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE'
    );
  next()
})

server.use('/api/places', placesRoutes); // => /api/places...

server.use('/api/users', usersRoutes)

server.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

server.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err)
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});
mongoose
  .connect('mongodb+srv://rm:btsleader@cluster0.vlfvq.mongodb.net/mern?retryWrites=true&w=majority')
  .then(() =>{
    server.listen(5000);
  })
  .catch(err => {
    console.log(err)
  });
