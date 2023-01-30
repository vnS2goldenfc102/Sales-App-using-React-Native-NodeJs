var multer  = require('multer')
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3001,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');
  cors = require('cors')
  dotenv = require('dotenv');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/hello_word',
{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
  console.log("Connected !!!")
}).catch(err => {
  console.log(err);
});
// Set up Global configuration access
dotenv.config();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'media')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname );
  }
})

const upload = multer({ storage }).single('file')
app.use(upload)
app.use(express.static('media'))
app.use(cors({}))
app.use(bodyParser.json());

var routes = require('./api/route');
routes(app, upload);


app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('Server started on: ' + port);
