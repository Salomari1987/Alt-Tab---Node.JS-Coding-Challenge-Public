//fetching all routes files.
var userController = require('../controllers/users');

var routes = function(app, express){
	//Initilizing routes
  router = express.Router();
  //user routes
  router.post('/register', userController.register);
  router.post('/login', userController.login)
  app.use('/api', router);
}

module.exports = routes;
