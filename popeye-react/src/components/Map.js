import React, { useState, useEffect } from "react";
import axios from 'axios';
import L from "leaflet";
import {
  TileLayer,
  MapContainer,
  LayersControl,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import Button from '@mui/material/Button';

const maps = {
  base: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

function Map(props) {

  const icon = L.icon({
    iconUrl:props.route === 'lunch' ? "walking.png" : (props.order === 'asc' ? "vehicle.png" : "vehicle_back.png"), iconSize: props.route === 'lunch' ? [48, 48] : [40, 26]
  });

  const [marker, setMarker] = useState(0);
  const [coordinates, setCoordinates] = useState(0);
  const [wSocket, setWSocket] = useState(0);
  
  const URL = 'ws://localhost:3001';
  
  useEffect(() => {

    // get coordinates of route and set initial starting point
    axios.get("http://localhost:3001/"+props.route, { crossdomain: true }).then((response) => {

      let coordinates =  response.data.map(coords => L.latLng(coords[1], coords[0]) );
      if (props.order === 'desc') {
        // reverse coordinates order when Work to Home
        coordinates = coordinates.reverse();
      }
      setCoordinates([coordinates[0]])

    });

  },[props]);

  // stop socket and set initial starting point
  const clickStopSocket = () => {
    resetCoordinates();
    wSocket.close();
    setMarker(0);
  }

  // set new time interval in miliseconds and restart route
  const setTimeInterval = (miliseconds) => {
    
    // close socket if open already
    if (wSocket !== 0) {
      wSocket.close();
    }

    // start new socket instance
    const ws = new WebSocket(URL);
    setWSocket(ws);
    
    // open socket
    ws.onopen = () => {
      console.log('WebSocket Connected');
      // send parameters to socket
      const message = { route: props.route, order: props.order, miliseconds: miliseconds };
      ws.send(JSON.stringify(message));
    }

    // get coordinates from socket
    ws.onmessage = (e) => {
      // get coordinates from socket
      const coords = JSON.parse(e.data);

      // get coordinates to current marker
      setMarker([coords[1], coords[0]])

      // let console log on purpose to monitor position changes
      console.log('recieved position for: ', props.route, coords)
    }
    
  }

  // reset route and get initial starting point from coordinates
  function resetCoordinates() {
    axios.get("http://localhost:3001/"+props.route, { crossdomain: true }).then((response) => {
      
      let coordinates =  response.data.map(coords => L.latLng(coords[1], coords[0]) );
      if (props.order === 'desc') {
        // reverse coordinates order when Work to Home
        coordinates = coordinates.reverse();
      }
      setCoordinates([coordinates[0]])

    });
  }


  return (
    <div>
    { coordinates.length > 0 ?
      <div>
      <h2>{props.title}</h2>
      <MapContainer
        center={coordinates[0]}
        zoom={18}
        zoomControl={false}
        style={{ height: "65vh", width: "100%", padding: 0 }}
        whenCreated={map => this.state.map}
      >
      { marker ?
         <Marker
           position={marker}
           icon={icon}
           key={marker}
          onMouseOver={(e: any) => {
         e.target.openPopup();
        }}
         onMouseOut={(e: any) => {
           e.target.closePopup();
         }}
           >
             <Popup>{marker}</Popup>
           </Marker>
         : 
         <Marker
           position={coordinates[0]}
           icon={icon}
           key={'25'}
          onMouseOver={(e: any) => {
         e.target.openPopup();
        }}
         onMouseOut={(e: any) => {
           e.target.closePopup();
         }}
           >
           <Popup>Start → {props.title}</Popup>
           </Marker>
       }
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Map">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url={maps.base}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <ZoomControl position="bottomleft" zoomInText="🧐" zoomOutText="🗺️" />
        <div className="leaflet-top leaflet-left">
          <div className="leaflet-control leaflet-bar">
            <Button onClick={() => setTimeInterval(1000)} variant="contained" className="btn" sx={{ ml: 0 }}>1 Second</Button>
            <Button onClick={() => setTimeInterval(5000)} variant="contained" className="btn" sx={{ mx: 2 }}>5 Seconds</Button>
            <Button onClick={() => setTimeInterval(10000)} variant="contained" className="btn" sx={{ mx: 2 }}>10 Seconds</Button>
            <Button onClick={() => clickStopSocket()} variant="contained" className="btn btn-danger danger">RESET</Button>
          </div>     
        </div>     
      </MapContainer>
      </div>
      : <h2>Loading...</h2>}

    </div>
  )
}
export default Map;
