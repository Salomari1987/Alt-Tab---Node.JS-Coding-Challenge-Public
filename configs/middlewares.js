let morgan = require('morgan');
let bodyParser = require('body-parser');

module.exports = function ( app, express ) {

  app.use(morgan('combined'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
  })
}
