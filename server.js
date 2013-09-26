var express = require('express'),
	app = express();

var mongoose = require('mongoose');

mongoose.connection.once('open', function () {
	console.log('MongoDB connection opened.');
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '));
mongoose.connect('mongodb://localhost:27017/test');

var CommentSchema = new mongoose.Schema({
  author: String,
  message: String,
  upvotes: {
    type: Number,
    default: 0
  },
  dateCommented: {
    type: Date,
    default: Date.now
  }
});
var Comments = mongoose.model('comments', CommentSchema);

// Setup CORS related headers
var corsSettings = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'origin, content-type, accept');
	next();
}

app.use(express.bodyParser());
app.use(corsSettings);

function comments(req, res) {
  Comments.find({}, function(err, docs) {
    if (err) {
      console.log(err);
      res.send(500, err);
    } else {
      console.log(docs);
      res.send(200, docs);
    }
  });
}

app.get('/comments', comments);
app.post('/comments', function(req, res) {
  Comments(req.body).save(function (err, doc) {
    if(err) console.log(err);
    console.log(doc);
    res.send(doc);
  });
});
app.delete('/comments', function(req, res) {
  console.log(req.body);
});

app.listen(9090);
