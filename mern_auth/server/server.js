const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// connect to the database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Error connecting to database', err));

// middleware
app.use(morgan('dev')); // API status codes and duration
app.use(bodyParser.json());
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: 'http://localhost:3000' })); // only accept calls from local
}

// routes
app.use('/api', authRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`API is running on port ${port} - ${process.env.NODE_ENV}`);
});
