let now = new Date();
let hours = (now.getHours()<10?'0':'') + now.getHours();
let minutes = (now.getMinutes()<10?'0':'') + now.getMinutes();
let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let day = weekDays[now.getDay()];

let date = document.querySelector("#date");
date.innerHTML = `<strong>${day}</strong> ${hours}:${minutes}`;

function formatForecastDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
}

function showForecast(response) {
    let forecastElement = document.querySelector("#forecast");
    console.log(response);

    let forecast = response.data.daily;

    let forecastHTML = `<div class="row">`;
    forecast.forEach(function (forecastDay, index) {
        if (index < 6) {
            forecastHTML = forecastHTML + `
            <div class="col-2">
              <p><strong>${formatForecastDay(forecastDay.dt)}</strong> | ${forecastDay.weather[0].main}</p>
              <div class="temp-future">
                <p>${Math.round(forecastDay.temp.max)}<sup>°C</sup></p><img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png">
              </div>
            </div>
            `;
         } 
    });

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
    let apiKey = `e6fdebf531f5bb945ca3ea115036c67c`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(showForecast);
}

function getWeather(response) {
    celciusTemperature = response.data.main.temp;
    
    document.querySelector("h1").innerHTML = response.data.name;
    document.querySelector("#temperature").innerHTML = Math.round(celciusTemperature);
    document.querySelector("#weather").innerHTML = response.data.weather[0].main;
    document.querySelector("#icon").setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    document.querySelector("#icon").setAttribute("alt", response.data.weather[0].description);
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = response.data.wind.speed;

    getForecast(response.data.coord);
}

function searchCity(city) {
    let apiKey = `aa80dfc499c569af8a15e578c09bbf2b`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(getWeather);
}

function handleSubmit(event) {
    event.preventDefault();
    let city = document.querySelector("#city").value;
    searchCity(city);
}

function showLocation(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiKey = `aa80dfc499c569af8a15e578c09bbf2b`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    axios.get(apiUrl).then(getWeather);
}

function getCurrentPosition(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(showLocation);
}

function showCelsius(event) {
    event.preventDefault();
    let temperature = document.querySelector("#temperature");
    tempFahrenheit.classList.remove("active");
    tempCelsius.classList.add("active");
    temperature.innerHTML = Math.round(celciusTemperature);
}

function showFahrenheit(event) {
    event.preventDefault();
    let temperature = document.querySelector("#temperature");
    tempCelsius.classList.remove("active");
    tempFahrenheit.classList.add("active");
    temperature.innerHTML = Math.round((celciusTemperature * 9) / 5 + 32);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentPosition);

let tempCelsius = document.querySelector("#tempCelsius");
let tempFahrenheit = document.querySelector("#tempFahrenheit");

tempCelsius.addEventListener("click", showCelsius);
tempFahrenheit.addEventListener("click", showFahrenheit);

let celciusTemperature = null;

searchCity("Portland");
