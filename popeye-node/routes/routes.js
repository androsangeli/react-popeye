// import routes
const lunchRoutes = require('./lunch');
const popeyeVillageBallutaRoutes = require('./popeyeVillageBalluta');

const appRouter = (app, fs) => {

    app.use(function(req, res, next) {
	  res.header('Access-Control-Allow-Origin', '*');
	  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	  next();
	});
	
	// default route
    app.get('/', (req, res) => {
        res.send('welcome to the Popeye Node Server');
    });

    // routes
    lunchRoutes(app, fs);
    popeyeVillageBallutaRoutes(app, fs);

};

module.exports = appRouter;