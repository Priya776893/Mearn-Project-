const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// OpenWeather API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Routes
app.get('/api/weather/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const response = await axios.get(`${OPENWEATHER_BASE_URL}?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        
        const weatherData = {
            city: response.data.name,
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon
        };
        
        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        if (error.response?.data?.message) {
            res.status(error.response.status).json({
                error: error.response.data.message
            });
        } else {
            res.status(500).json({
                error: 'Failed to fetch weather data. Please try again.'
            });
        }
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', port: port });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 