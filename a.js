
function capitalizeWords(text) {
    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ")
}


const weatherApiKey = "7fab3591ba29508307ca0c61579e9778";
const unsplashApiKey = 'bRK_Zi9tmjOx18MSRJyS5-XWDRhlleUOYBsDsZVHzNQ'
const locButton = document.querySelector('.loc-button')
const todayInfo = document.querySelector('.today-info')
const todayWeatherIcon = document.querySelector('.today-weather i')
const todayTemp = document.querySelector('.weather-temp')
const daysList = document.querySelector('.days-list')


const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain ',
    '09n': 'cloud-rain ',
    '11d': 'cloud-lighting ',
    '11n': 'cloud-lighting ',
    '13d': 'cloud-snow ',
    '13n': 'cloud-snow ',
    '50d': 'water ',
    '50n': 'water ',
}

async function fetchWeatherData(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${location}&appid=${weatherApiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json()

        console.log(data)

        // Main Card Elements 
        const todayWeather = data.weather[0].description;
        const todayTemperature = `${Math.round(data.main.temp)}°C`;
        const todayWeatherIconCode = data.weather[0].icon;
        const todayWeatherLocation = `${data.name}, ${data.sys.country}`;

        todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('en', { weekday: 'long' })

        todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })

        const locationElement = document.querySelector('.today-info > div > span')
        locationElement.textContent = todayWeatherLocation

        todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`
        todayTemp.textContent = todayTemperature;

        const weatherDescriptionElement = document.querySelector('.today-weather > h4');
        weatherDescriptionElement.textContent = capitalizeWords(todayWeather);

        fetchCityImage(location)

    } catch (error) {
        alert(`Error fetching weather data: ${error} (API Error)`)      
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Manila'
    fetchWeatherData(defaultLocation)
})

locButton.addEventListener('click', () => {
    const input = document.querySelector('.loc-input').value
    fetchWeatherData(input)
})


async function fetchCityImage(location) {

    const imageElement = document.querySelector('.left-info');

    try {
        const data = await fetchImage(location)
        const image = data.results.find(imageData => imageData.height > imageData.width) ? data.results.find(imageData => imageData.height > imageData.width) : data.results[0];
        const imgURL = image.urls.regular
        imageElement.style.background = `url("${imgURL}") center / cover`

    } catch (error) {
        const defaultImageURL = "https://images.unsplash.com/photo-1559683640-941a04be4bb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80"
        imageElement.style.background = `url("${defaultImageURL}") center / cover`
        console.log(error)
    }


}

async function fetchImage(query){
    const apiKey = 'bRK_Zi9tmjOx18MSRJyS5-XWDRhlleUOYBsDsZVHzNQ'
    const apiUrl = `https://api.unsplash.com/search/photos?page=1&per_page=10&query=${query}&client_id=${apiKey}`;

    try {
        const response = await fetch(apiUrl)
        const data = await response.json();
        return data

    } catch (error) {
        return error
    }
}