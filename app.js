console.clear();
const ow = {
    appId: 'e7ce94cc98e49a5c72dd32e24f5edc85',
    isOnCooldown: false,
    clownMode: false,
    audioFiles: [
        { url: 'audio/metal_pipe.mp3', volume: 0.1 },
        { url: 'audio/barbecue_bacon_burger.mp3', volume: 0.3 },
        { url: 'audio/fart.mp3', volume: 0.2 },
        { url: 'audio/hunter.mp3', volume: 0.15 },
        { url: 'audio/taco_bell.mp3', volume: 0.2 },
        { url: 'audio/bababooey.mp3', volume: 0.8 },
        { url: 'audio/vine_boom.mp3', volume: 0.4 },
        { url: 'audio/bad_to_the_bone.mp3', volume: 1 },
    ],
    end: null,
    interval: null,
    hasReceivedData: false,
    geo: {
        url: 'http://api.openweathermap.org/geo/1.0/direct?q={city}&limit={maxResults}&appid={apiKey}',
        data: { lon: null, lat: null, name: null },
    },
    weather: {
        url: 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}&units=metric',
        data: null,
    },
    forecast: {
        url: 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}',
        data: null,
    },
};

const searchBar = document.getElementById('search-bar');
const prompt = searchBar.value;
const main = document.getElementById('main');
const weatherInfo = document.getElementById('main-info');
const mainInfo = document.querySelectorAll('#main-info p');
const airConditions = document.getElementById('air-conditions');
const clownMode = document.getElementById('clown-mode');

clownMode.addEventListener('click', (e) => {
    ow.clownMode = !ow.clownMode;
    console.log(`Clown Mode is now ${ow.clownMode ? 'ON' : 'OFF'}`);
});

function playAudio(url) {
    try {
        const audio = new Audio(url.url);
        audio.volume = url.volume;
        audio
            .play()
            .catch((err) => console.error('Audio Playback failed: ', err));
        console.log(`Playing sound file ${url.url} at ${url.volume} volume`);
    } catch (err) {
        console.error('Error playing audio: ', err);
    }
}

function playRandomAudio() {
    try {
        const randomFile =
            ow.audioFiles[Math.floor(Math.random() * ow.audioFiles.length)];
        playAudio(randomFile);
    } catch (err) {
        console.error('Error playing audio: ', err);
    }
}

window.addEventListener('keypress', (e) => {
    if (ow.clownMode) {
        console.log(`Input detected: ${e.data}`);
        playRandomAudio();
    }
});

searchBar.addEventListener('input', (d) => {
    const spl = d.target.value.split('');
    if (spl.length >= 58) {
        spl.length = 58;
        d.target.value = spl.join('');
    }
});

searchBar.addEventListener('keyup', (k) => {
    if (k.code === 'Enter' || k.keyCode === 13) {
        if (!k.target.value) {
            return;
        } else {
            getWeather(k.target.value);
        }
    }
});

async function getWeather(prompt) {
    if (!prompt) {
        console.error('No prompt found.');
    }

    try {
        const geoUrl = ow.geo.url
            .replace('{city}', prompt)
            .replace('{maxResults}', 1)
            .replace('{apiKey}', ow.appId);
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            console.error('No city found.');
        } else {
            ow.geo.data.lon = geoData[0].lon;
            ow.geo.data.lat = geoData[0].lat;
            ow.geo.data.name = geoData[0].name;
        }

        try {
            const weatherUrl = ow.weather.url
                .replace('{lon}', ow.geo.data.lon)
                .replace('{lat}', ow.geo.data.lat)
                .replace('{apiKey}', ow.appId);
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();
            ow.weather.data = weatherData;
            console.log(ow.weather.data);
            updateUI(ow.weather.data);
        } catch (e) {
            console.error(e);
        }

        try {
            const forecastUrl = ow.forecast.url
                .replace('{lon}', ow.geo.data.lon)
                .replace('{lat}', ow.geo.data.lat)
                .replace('{apiKey}', ow.appId);
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();
            ow.forecast.data = forecastData;
        } catch (e) {
            console.error(e);
        }
    } catch (e) {
        console.error(e);
    }
}

function getCountryName(code, locale = 'fr') {
    const displayNames = new Intl.DisplayNames([locale], { type: 'region' });
    return displayNames.of(code);
}

function updateUI(data) {
    const weatherCode = ow.weather.data.weather[0].id;
    const city = document.createElement('p');
    const country = document.createElement('p');
    const temp = document.createElement('p');
    const icon = document.createElement('img');

    city.textContent = ow.geo.data.name;
    country.textContent = getCountryName(ow.weather.data.sys.country);
    temp.textContent = ow.weather.data.main.temp.toFixed(1) + '°C';
    icon.id = 'weather-icon';

    if (weatherCode >= 200 && weatherCode <= 232) {
        icon.src = './icons/thunderstorm.png';
    } else if (weatherCode >= 300 && weatherCode <= 321) {
        icon.src = './icons/rain.png';
    } else if (weatherCode >= 500 && weatherCode <= 531) {
        icon.src = './icons/rain.png';
    } else if (weatherCode >= 600 && weatherCode <= 622) {
        icon.src = './icons/snowflakes.png';
    } else if (weatherCode >= 801 && weatherCode <= 804) {
        icon.src = './icons/slightly_cloudy.png';
    }
    switch (ow.weather.data.weather[0].id) {
        case 701:
            icon.src = './icons/fog.png';
            break;
        case 711:
            icon.src = './icons/fire.png';
            break;
        case 721:
            icon.src = './icons/haze.png';
            break;
        case 731:
            icon.src = './icons/dust.png';
            break;
        case 741:
            icon.src = './icons/fog.png';
            break;
        case 751:
            icon.src = './icons/sand.png';
            break;
        case 800:
            icon.src = './icons/sun.png';
            break;
    }
    weatherInfo.innerHTML = '';
    weatherInfo.appendChild(city);
    weatherInfo.appendChild(country);
    weatherInfo.appendChild(temp);
    weatherInfo.appendChild(icon);
}
