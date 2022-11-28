import React from "react";
import LineChart from "./components/LineChart";
import data from './data/my_weather_data.json';

function App() {
  return (
    <div className="App">
      <LineChart Data={data} />
    </div>
  );
}

export default App;
