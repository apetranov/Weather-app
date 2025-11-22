import { useState, useEffect } from 'react'

import './App.css'

function App() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("")
  const [wind, setWind] = useState(0);
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  const API_KEY = import.meta.env.VITE_API_KEY;

  // let city = "London";

  const GEOCODING = `https://api.api-ninjas.com/v1/geocoding?city=${city}`;
  
  async function fetchGeo() {
    setIsLoading(true);
    try {
      // --- 1. Geocoding API call ---
      const geoRes = await fetch(GEOCODING, {
        headers: { "X-Api-Key": API_KEY },
      });
      const geoData = await geoRes.json();

      if (geoData.length > 0) {
        const lat = geoData[0].latitude;
        const lon = geoData[0].longitude;

        setLatitude(lat);
        setLongitude(lon);

        console.log(lat);
        console.log(lon);

        try {
          // --- 1. Geocoding API call ---
          const weatherRes = await fetch(`https://api.api-ninjas.com/v1/weather?lat=${lat}&lon=${lon}`, {
            headers: { "X-Api-Key": API_KEY },
          });
          const weatherData = await weatherRes.json();

          if (weatherData) {
            const temp = weatherData['temp'];
            const wind = weatherData['wind_speed'];
            setTemp(temp);
            setWind(wind);

            console.log("temp:",temp);
          }
        } catch (err) {
          console.error(err);
        }

      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (city) {
      fetchGeo();
    }
  }, [city]);

  // async function fetchWeather(lat, lon) {
  //   if (!latitude || !longitude) return;

  //     }

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    console.log(city);
  }

  
  return (
    <div className='flex flex-col justify-center items-center h-screen space-y-5'>
      <div className='flex flex-col md:flex-row justify-center items-center gap-2 '>
        <input 
          onChange={handleChange} 
          type="text" 
          value={inputValue}  // Change from city to inputValue
          className='outline-1 outline-black rounded-lg p-2' 
          placeholder='Enter city...' 
        />        
        <button className='bg-indigo-600 px-7 py-3 hover:bg-indigo-400 hover:cursor-pointer text-white rounded-full' onClick={() => {
            setCity(inputValue);
          }}>Search</button>
      </div>
      {isLoading ? (
        <h1 className='text-xl animate-pulse'>Loading weather data...</h1>
      ) : temp && city ? (
        <div className='flex flex-col justify-center items-center space-y-5 outline-1 outline-indigo-600 p-5 w-[80%] md:w-[30%] rounded-lg'>
          <h1 className='text-6xl'>{temp >= 15 ? "☀️" : "❄️"}</h1>
          <h2 className='text-2xl'>
            {city} {temp}°C{" "}
          </h2>
          <h2 className='text-2xl'>
            💨 {wind}
          </h2>
        </div>
      ) : (
        <h1>Please type a city</h1>
      )}
    </div>
  )
}

export default App
