import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../weathercom/weather.css';  // Import the CSS file

const WeatherWidget = () => {
  const [cities, setCities] = useState(['London', 'New York']);  // Set only 2 cities
  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = '033f19189a8ab629d8ac47ab098e86ef'; // Replace with your actual OpenWeatherMap API key

  const fetchWeatherForCities = async (cities) => {
    setLoading(true);
    setError(null);
    const weatherData = {};
    const forecastData = {};

    try {
      const requests = cities.map(city =>
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
          )
          .then(response => {
            weatherData[city] = response.data;
          })
      );

      const forecastRequests = cities.map(city =>
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
          )
          .then(response => {
            forecastData[city] = response.data;
          })
      );

      await Promise.all([...requests, ...forecastRequests]);

      setWeatherData(weatherData);
      setForecastData(forecastData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        setError('Error: No response received from server');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherForCities(cities);
  }, [cities]);

  const handleCityChange = (index, e) => {
    const newCities = [...cities];
    newCities[index] = e.target.value;
    setCities(newCities);
  };

  // Function to get a summary for the next day's forecast
  const getNextDayForecast = (city) => {
    const cityForecast = forecastData[city];
    if (!cityForecast) return null;

    // Get the date for the next day (ignoring the current day)
    const currentDate = new Date();
    const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
    const nextDayDateString = nextDay.toISOString().split('T')[0]; // Get the date (yyyy-mm-dd)

    // Find the first forecast entry for the next day
    const nextDayForecast = cityForecast.list.find((entry) => {
      return entry.dt_txt.includes(nextDayDateString);
    });

    return nextDayForecast || null;
  };

  return (
    <div className="weather-widget">
      <h1>Weather Widget</h1>
      {cities.map((city, index) => (
        <div key={index}>
          <input
            type="text"
            value={city}
            onChange={(e) => handleCityChange(index, e)}
            placeholder="Enter city"
          />
        </div>
      ))}
      <button onClick={() => fetchWeatherForCities(cities)}>Get Weather</button>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {Object.keys(weatherData).length > 0 && (
        <div>
          {Object.entries(weatherData).map(([city, data]) => (
            <div key={city}>
              <h2>{data.name}</h2>
              <p>Temperature: {data.main.temp}°C</p>
              <p>Description: {data.weather[0].description}</p>
              <img
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                alt={data.weather[0].description}
              />
              <h3>Next Day Forecast:</h3>
              {forecastData[city] && getNextDayForecast(city) ? (
                <div>
                  <h4>{getNextDayForecast(city).dt_txt.split(' ')[0]}</h4> {/* Display only the date */}
                  <p>
                    Temp: {getNextDayForecast(city).main.temp}°C -{' '}
                    {getNextDayForecast(city).weather[0].description}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${getNextDayForecast(city).weather[0].icon}@2x.png`}
                    alt={getNextDayForecast(city).weather[0].description}
                  />
                </div>
              ) : (
                <p>No forecast data available</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
