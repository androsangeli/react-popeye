const express = require('express');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// get routes when http protocal is requested
const routes = require('./routes/routes.js')(app, fs);

const server = createServer(app);
const wss = new WebSocket.Server({ server });

// connect to socket and get routes when ws protocal is requested
wss.on('connection', function (ws) {

// store all intervals in 1 array to reset them all on close
let intervals = [];

  ws.on('message', function message(data) {
   
   // get route parameters from frontend
   const routeData = JSON.parse(data);
   
    // get the json data
    fs.readFile('assets/data/'+ routeData.route + '.geojson', (err, geodata) => {
      
      if (err) throw err;
      
      // get json data from files
      let geoObject = JSON.parse(geodata);


      let intervalIteration  = 0;
      if (routeData.order === 'desc') {
        // reverse coordinates order when Work to Home
        geoObject.features[0].geometry.coordinates = geoObject.features[0].geometry.coordinates.reverse();
      }
      
      // start intervals loop
      intervals[0] = setInterval(function () {
    
        // send the route position
        ws.send(JSON.stringify(geoObject.features[0].geometry.coordinates[intervalIteration]), function () {
          
          // set iteration to index of next position inside coordinates array
          intervalIteration ++;
          if(intervalIteration === geoObject.features[0].geometry.coordinates.length) {
            clearInterval(intervals[0])
          }

        });
        
      }, routeData.miliseconds);

        
    });
  });

  ws.on('close', function () {
    
    // clear all intervals
    for (let i = 0; i < intervals.length; i++) {
      clearInterval(intervals[i]);
    }

  });
});

server.listen(3001, () => {
    console.log('listening on port %s...', server.address().port);
});