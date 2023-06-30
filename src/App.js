import { useEffect, useState } from "react";
import "./App.css";
import hotBg from "./images/Hot weather.jpeg";
import coldBg from "./images/winter-weather.jpg";
import Descriptions from "./Descriptions";
import { getFormatedWeatherData } from "./WeatherService";

function App() {
  const [city, setCity] = useState("Paris");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);
  const [info, setInfo] = useState("")
  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormatedWeatherData(city, units);
      setWeather(data);
      const threshold = units === "metric" ? 25 : 60;
      if (data.temp <= threshold) {
        setBg(coldBg);
      } else {
        setBg(hotBg)
      }
    };
    fetchWeatherData();
  }, [units, city]);
  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(-1);
    const isCelcius = currentUnit === "C";
    button.innerText = isCelcius ? "°F" : "°C";
    setUnits(isCelcius ? "metric" : "imperial");
  };
  const enterKeyPressed = (e) => {
    setInfo("Click enter to search city")
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
      setInfo("")
    }
  };
  return (
    <div className="App" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section__inputs">
              <input
                type="text"
                onKeyDown={enterKeyPressed}
                placeholder="enter city/country"
                onFocus={enterKeyPressed}
              />
              <p className="info" onKeyDown={enterKeyPressed}>{info}</p>
              <button onClick={(e) => handleUnitsClick(e)}>&deg;F</button>
            </div>
            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weather icon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>
                  {`${weather.temp.toFixed()}`}&deg;
                  <span>{units === "metric" ? "C" : "F"}</span>
                </h1>
              </div>
            </div>
            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
