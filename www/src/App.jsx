import React from "react";
import Chart1 from './components/Chart1';
import data from './data/my_weather_data.json';

function App() {
  return (
    <div className="App">
      <Chart1 Data={data} />
    </div>
  );
}

export default App;
