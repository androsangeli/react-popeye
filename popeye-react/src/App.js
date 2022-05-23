import React, { useEffect } from "react";
import logo from './assets/img/LogoRedAcrefulllogocoloured.png';
import 'leaflet/dist/leaflet.css'
import './App.css';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Map from "./components/Map";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const routes = [
  { value:'home_to_work', text:'Home → to → Work' },
  { value:'lunch', text:'Lunch' },
  { value:'work_to_home', text:'Work → to → Home' },
  { value:'all', text:'All Routes'}
]

function App() {

  const [route, setRoute] = React.useState('home_to_work');

  const handleChange = (event: SelectChangeEvent) => {
    setRoute(event.target.value);
  };
  
  useEffect(() => {

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        { <img src={logo} className="App-logo" alt="logo" /> }
        <p>
          Popeye joins Red Acre
        </p>
        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }} bgcolor="white">
          <Grid item xs={2} sx={{ my: 2 }} color="common.black">Routes List Box</Grid>
          <Grid item xs={2} sx={{ my: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Route</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={route}
                label="Route"
                onChange={handleChange}
                variant="outlined"
              >
              {
                routes.map((value, index) => (
                <MenuItem key={value.value} value={value.value}>{value.text}</MenuItem>
                ))
              }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8}></Grid>
        </Grid>
        <Grid container spacing={2}>
          { route === 0 ?
          <Grid item xs={ route !== 'all' ? 12 : 4 }>
            <Item><Map route="popeye-village-balluta" order="asc" title="Home to Work"/></Item>
          </Grid>
          : ''}
          { route === 'all' || route === 'home_to_work' ?
          <Grid item xs={ route !== 'all' ? 12 : 4 }>
            <Item><Map route="popeye-village-balluta" order="asc" title="Home to Work"/></Item>
          </Grid>
          : ''}
          { route === 'all' || route === 'lunch' ?
          <Grid item xs={ route !== 'all' ? 12 : 4 }>
            <Item><Map route="lunch" order="asc" title="Lunch"/></Item>
          </Grid>
          : ''}
          { route === 'all' || route === 'work_to_home' ?
          <Grid item xs={ route !== 'all' ? 12 : 4 }>
            <Item><Map route="popeye-village-balluta" order="desc" title="Work to Home"/></Item>
          </Grid>
          : ''}
        </Grid>
      </header>
    </div>
  );
}

export default App;
