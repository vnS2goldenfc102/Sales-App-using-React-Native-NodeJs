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
    let uploadFile = file.originalname.split('.')
    let name = `${uploadFile[0]}-${Date.now()}.${uploadFile[uploadFile.length-1]}`
    cb(null, name)
  }
})

const upload = multer({ storage: storage }).single()
app.use(upload)
app.use(express.static('media'))
app.use(cors({}))
app.use(bodyParser.json());

var routes = require('./api/route');
routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('Server started on: ' + port);
