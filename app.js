const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');

const app = express();

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });

app.set('view engine', 'ejs');




app.get('/', function(req, res) {
  res.render('landing');
})

app.get('/campgraunds', function(req, res) {
  res.render('campgraunds');
})










const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});