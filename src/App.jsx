import { useState, useEffect } from 'react'

import './App.css'

function App() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("")

  const API_KEY = import.meta.env.VITE_API_KEY;

  // let city = "London";

  const GEOCODING = `https://api.api-ninjas.com/v1/geocoding?city=${city}`;
  
  async function fetchGeo() {
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
            setTemp(temp);

            console.log("temp:",temp);
          }
        } catch (err) {
          console.error(err);
        }

      }
    } catch (err) {
      console.error(err);
    }
  }

  // async function fetchWeather(lat, lon) {
  //   if (!latitude || !longitude) return;

  //     }

  const handleChange = (e) => {
    setCity(e.target.value); // update state on every keystroke
  };

  const handleSubmit = () => {
    console.log(city);
  }

  
  return (
    <div className='flex flex-col justify-center items-center h-screen space-y-5'>
      <div className='flex flex-row justify-center items-center gap-2'>
        <input onChange={handleChange} type="text" value={city} className='outline-1 outline-black' placeholder='Enter city...' />
        <button className='bg-indigo-600 px-7 py-3 hover:bg-indigo-400 hover:cursor-pointer text-white rounded-full' onClick={() => {
          handleSubmit;
          fetchGeo();
        }}>Search</button>
      </div>
      {temp && city ? (
        <div className='flex flex-col justify-center items-center space-y-5'>
          <h1 className='text-6xl'>{temp >= 15 ? "☀️" : "❄️"}</h1>
          <h2 className='text-2xl'>
            {city} {temp}°C{" "}
            
          </h2>
        </div>
      ) : (
        <h1>Please type a city</h1>
      )}

    </div>
  )
}

export default App
