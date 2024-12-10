console.clear();
const ow = {
    appId: 'e7ce94cc98e49a5c72dd32e24f5edc85',
    weather:
        'https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}',
    geo: 'http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${maxResults}&appid=${apiKey}',
    isOnCooldown: false,
    end: null,
    interval: null,
    hasReceivedData: false,
};

function checkLocationPermission(status) {
    switch (status) {
        case 'granted':
            currentLocation.style.filter = 'none';
            break;
        // case 'prompt':
        //     currentLocation.style.filter = 'grayscale(100%)';
        //     break;
        case 'denied':
            currentLocation.textContent = '❌';
            currentLocation.style.filter = 'grayscale(100%)';
            currentLocation.disabled = 'true';
            currentLocation.addEventListener('mouseover', () => {
                currentLocation.style.cursor = 'not-allowed';
                currentLocation.style.backgroundColor = '#c9c9c9';
            });
            break;
    }
}

function findCity(prompt) {
    const url = ow.geo
        .replace('${apiKey}', ow.appId)
        .replace('${maxResults}', 5)
        .replace('${city}', prompt);
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((d) => {
            console.log(getCurrentWeather(d));
        })
        .catch((err) => console.error(err));
}

function getCurrentWeather(city) {
    navigator.permissions
        .query({ name: 'geolocation' })
        .then((permissionStatus) =>
            checkLocationPermission(permissionStatus.state)
        )
        .then(() => {
            let url = city[0];
            // if (typeof city === 'array') {
            //     url = ow.weather
            //         .replace('${apiKey}', ow.appId)
            //         .replace('${lon}', city[0].lon)
            //         .replace('${lat}', city[0].lat);
            // } else if (typeof city !== 'array') {
            //     url = ow.weather
            //         .replace('${apiKey}', ow.appId)
            //         .replace('${lon}', city.lon)
            //         .replace('${lat}', city.lat);
            // }
            fetch(url)
                .then((response) => {
                    ow.hasReceivedData = true;
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                });
        })
        .catch((err) => {
            ow.hasReceivedData = false;
            console.error(err);
        });
}

const errorSign = document.getElementById('error-box');

window.addEventListener('load', () => {
    checkLocationPermission();
});

const cityLookup = document.getElementById('city-lookup');
const currentLocation = document.getElementById('current-location');

cityLookup.addEventListener('input', (d) => {
    let prompt = d.target.value;
    let arr = prompt.split('');
    if (arr.length > 58) arr.length = 58;
    cityLookup.value = arr.join('');
});

cityLookup.addEventListener('keyup', (d) => {
    if (d.keyCode === 13 || d.code === 'Enter') {
        if (!d.target.value || d.target.value === '') {
            return;
        }

        if (!ow.isOnCooldown && !ow.hasReceivedData) {
            const city = findCity(d.target.value);
            getCurrentWeather(city);

            const date = new Date();
            ow.end = new Date(date.getTime() + 15000);
            ow.isOnCooldown = true;

            ow.interval = setInterval(() => {
                errorSign.children[0].textContent = `Vous devez attendre ${(
                    (ow.end - new Date().getTime()) /
                    1000
                ).toFixed(1)}s avant de pouvoir envoyer une autre requête.`;
            }, 100);

            setTimeout(() => {
                ow.start = null;
                ow.end = null;
                ow.cooldown = null;
                clearInterval(ow.interval);
                ow.interval = null;
                ow.isOnCooldown = false;
                errorSign.children[0].textContent = `Vous devez attendre 0.0s avant de pouvoir envoyer une autre requête.`;
                errorSign.style.bottom = '-20%';
            }, 15000);
        } else {
            errorSign.style.bottom = '0%';
        }
    }
});

currentLocation.addEventListener('click', () => {
    checkLocationPermission();
});

// const data = fetch();
