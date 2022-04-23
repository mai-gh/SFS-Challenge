const express = require('express');
const app = express();
app.use(express.json())
const path = require('path');
const morgan = require('morgan');
const PORT = 3000;
let jsonData = require('./data.json');


app.use(morgan('dev'));


// GET index
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.use(express.static(path.join(__dirname, 'public')))

// get data
app.get('/api', async (req, res, next) => {
  try {
    res.send(jsonData);
  } catch (ex) {
    next(ex);
  }
});


// add row
app.post('/api', async (req, res, next) => {
  try {
    console.log(req.body)
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});


// delete row
app.delete('/api', async (req, res, next) => {
  try {
//    console.log(req)
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
})


// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message });
});

module.exports = app;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

