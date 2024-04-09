document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Manila';
    handleLocationChange(defaultLocation);

    const input = document.querySelector('.loc-input');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
        const selectedPlace = autocomplete.getPlace();
        if (selectedPlace && selectedPlace.formatted_address) {
            handleLocationChange(selectedPlace.formatted_address);
        }
    });
});

const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-drizzle',
    '09n': 'cloud-drizzle',
    '10d': 'cloud-light-rain ',
    '10n': 'cloud-light-rain ',
    '11d': 'cloud-lighting ',
    '11n': 'cloud-lighting ',
    '13d': 'cloud-snow ',
    '13n': 'cloud-snow ',
    '50d': 'water ',
    '50n': 'water ',
}

function fetchWeatherData(location) {
    const apiKey = "7fab3591ba29508307ca0c61579e9778";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${location}&appid=${apiKey}`;

    fetch(apiUrl).then(response => response.json()).then(data => {

        const todayInfo = document.querySelector('.today-info')
        const todayWeatherIcon = document.querySelector('.today-weather i')
        const todayTemp = document.querySelector('.weather-temp')
        const daysList = document.querySelector('.days-list')

        const todayWeather = data.list[0];

        const weatherDescriptionElement = document.querySelector('.today-weather > h4');
        const todayWeatherDescription = todayWeather.weather[0].description;
        weatherDescriptionElement.textContent = capitalizeWords(todayWeatherDescription);

        const todayTemperature = `${Math.round(todayWeather.main.temp)}°C`;
        todayTemp.textContent = todayTemperature;

        const todayWeatherIconCode = todayWeather.weather[0].icon;
        todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`

        const todayWeatherLocation = `${data.city.name}, ${data.city.country}`;
        const locationElement = document.querySelector('.today-info > div > span')
        locationElement.textContent = todayWeatherLocation

        console.log(`${todayWeatherDescription} (${todayWeatherIconCode}) in ${todayWeatherLocation}`)


        todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('en', { weekday: 'long' })
        todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })

        const precipitation = document.querySelector('.precipitation')
        precipitation.textContent = `${Math.round(todayWeather.pop * 100)} %`

        const humidity = document.querySelector('.humidity')
        humidity.textContent = `${todayWeather.main.humidity} %`

        const wind_speed = document.querySelector('.wind_speed')
        wind_speed.textContent = `${Math.round(todayWeather.wind.speed)} km/h`

        const today = new Date();
        const nextDaysData = data.list.slice(1);

        const uniqueDays = new Set();
        let count = 0;
        daysList.innerHTML = '';
        for (const dayData of nextDaysData) {
            const forecastDate = new Date(dayData.dt_txt);
            const dayAbbreviation = forecastDate.toLocaleDateString('en', {
                weekday: 'short'
            })
            const dayTemp = `${Math.round(dayData.main.temp)}°C`
            const iconCode = dayData.weather[0].icon;

            if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
                uniqueDays.add(dayAbbreviation);
                daysList.innerHTML += `
                <li>
                    <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                    <span>${dayAbbreviation}</span>
                    <span class="day-temp">${dayTemp}</span>
                </li>
                
                `;
                count++;
            }

            if (count === 5) break;
        }


    }).catch(error => {
        alert(`Error fetching weather data: ${location} is not listed in OpenWeather (API Error)`)
    })

}


const locButton = document.querySelector('.loc-button')
const locInput = document.querySelector('.loc-input')

locButton.addEventListener('click', () => {
    const input = locInput.value
    handleLocationChange(input)
})

locInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const input = locInput.value;
        handleLocationChange(input)
    }
});

function handleLocationChange(location) {
    fetchWeatherData(location);
    fetchCityImage(location);
    fetchCurrentTime(location); 

}

function fetchCityImage(placeIdOrAddress) {
    const imageElement = document.querySelector('.left-info');
    // If the input is a place_id, directly use it; otherwise, perform a place search
    const request = placeIdOrAddress.startsWith('place_id:')
        ? { placeId: placeIdOrAddress, fields: ['photos'] }
        : { query: placeIdOrAddress, fields: ['photos'] };

    const service = new google.maps.places.PlacesService(document.createElement('div'));

    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            const place = results[0];
            if (place.photos && place.photos.length > 0) {
                const photoUrl = place.photos[0].getUrl();
                imageElement.style.background = `url("${photoUrl}") center / cover`

            }
        }
    });
}
 
