// format date from the timestamp (when loading a page or based on data from API)
function formatDate(timestamp) {
  let currentTime = new Date(timestamp);
  let currentDateTimeElement = document.querySelector("#current-date-time");
  let h2Day = document.querySelector("#current-day");

  let dayIndex = currentTime.getDay();
  let date = currentTime.getDate();
  let month = currentTime.getMonth();
  let year = currentTime.getFullYear();
  let hours = currentTime.getHours();
  hours = hours < 10 ? `0${hours}`: hours;
  let minutes = currentTime.getMinutes();
  minutes = minutes < 10 ? `0${minutes}`: minutes;
  
  // show current day of the week (h2)
  let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  let shownDay = weekDays[dayIndex];
  h2Day.innerHTML = shownDay;

  // show current date and time (p #current-date-time)
  let shownDateTime = `${date}.${month+1}.${year} ${hours}:${minutes}`
  currentDateTimeElement.innerHTML = shownDateTime;
}

// Open Weather API - display current data (city name, temp etc.)
function showWeather(response) {
  let currentTemp = Math.round(response.data.main.temp);
  let currentFeelsLike = Math.round(response.data.main.feels_like);
  let currentHumidity = response.data.main.humidity;
  let currentPressure = response.data.main.pressure;
  let currentWeatherDescription = (response.data.weather[0]).description;
  let currentWeatherIconName = (response.data.weather[0].main).toLowerCase()
  let city = response.data.name;
  let country = response.data.sys.country;
  let currentDateTime = response.data.dt*1000

  currentCelsiusTemp = currentTemp;
  currentCelsiusTempFeelsLike = currentFeelsLike;

  let tempElement = document.querySelector("#current-temperature");
  let weatherDescriptionElement = document.querySelector("#current-weather-description");
  let feelsLikeElement = document.querySelector("#current-feels-like");
  let humidityElement = document.querySelector("#current-humidity");
  let pressureElement = document.querySelector("#current-pressure");
  let iconElement = document.querySelector("#current-weather-icon");

  let h1City = document.querySelector("h1");
  h1City.innerHTML = `${city}, ${country}` || h1City.innerHTML;

  formatDate(currentDateTime);

  tempElement.innerHTML = currentTemp;
  weatherDescriptionElement.innerHTML = currentWeatherDescription;
  feelsLikeElement.innerHTML = `${currentFeelsLike} °C`;
  humidityElement.innerHTML = currentHumidity;
  pressureElement.innerHTML = currentPressure;
  iconElement.setAttribute("src", `images/${currentWeatherIconName}.png`)
  iconElement.setAttribute("alt", currentWeatherIconName)

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
} 

// get names of next days for the forecast
function getDayName(timestamp) {
  let time = new Date(timestamp);
  let dayIndex = time.getDay();
  let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return weekDays[dayIndex];
}

// show day, icon, temperature and perceived temperature for next 4 days
function showForecast(response) {
  let forecastElement = document.querySelector(".next-days")
  let forecast = null;
  let iconName = null;
  forecastElement.innerHTML = null

  for (let index = 8; index <= 32; index+=8) {
    forecast = response.data.list[index];
    iconName = (forecast.weather[0].main).toLowerCase();
    console.log(forecast.main);
    let temp = forecast.main.temp;
    let tempFeelsLike = forecast.main.feels_like;
    forecastElement.innerHTML += `
    <div>
    <h3>${getDayName(forecast.dt*1000)}</h3>
    <img src="images/${iconName}.png" alt="${iconName}" class="small-icon" />
    <h4 class="celsiusForecast">${Math.round(temp)} | <i class="fas fa-child fa-sm"></i> ${Math.round(tempFeelsLike)}°C</h4>
     <h4 class="fahrenheitForecast hidden">${Math.round((temp*9)/5+32)} | <i class="fas fa-child fa-sm"></i> ${Math.round((tempFeelsLike*9)/5+32)}°F</h4>
    </div>`
  }
}//

// get the current weather (temp, hum...) in the city
function getCityWeather (event) {
  event.preventDefault();
  let citySearch = document.querySelector("#city-search");
  let enteredCity = citySearch.value.trim().toLowerCase();
  if (enteredCity !== "") {
    citySearch.value = "";
  // Open Weather API - ask for current weather for the city
  apiUrl = `${apiEndpoint}?q=${enteredCity}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
  //Open Weather API - ask for forecast
  apiUrlForecast = `${apiEndpointForecast}?q=${enteredCity}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlForecast).then(showForecast);
  }
}

// geolocation
function getLocationWeather (position) {
  let currentLatitude = position.coords.latitude;
  let currentLongitude = position.coords.longitude;
  // Open Weather API - ask for current weather for qeolocation
  apiUrl = `${apiEndpoint}?lat=${currentLatitude}&lon=${currentLongitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
  //Open Weather API - ask for forecast
  apiUrlForecast = `${apiEndpointForecast}?lat=${currentLatitude}&lon=${currentLongitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlForecast).then(showForecast);
}
// get coordinates of the device
function getGeolocationCoords (event) {
  navigator.geolocation.getCurrentPosition(getLocationWeather);
}

// C->F
// show temperature (current and feels like in °F), change style of selected degrees (switch class active)
function changeToFahrenheit (event) {
  event.preventDefault();
  let currentTemperatureElement = document.querySelector("#current-temperature");
  let currentFeelsLikeElement = document.querySelector("#current-feels-like");
  let currentFahrenheitTemp = Math.round((currentCelsiusTemp*9)/5+32);
  let currentFahrenheitTempFeelsLike = Math.round((currentCelsiusTempFeelsLike*9)/5+32);
  currentTemperatureElement.innerHTML = currentFahrenheitTemp;
  currentFeelsLikeElement.innerHTML = `${currentFahrenheitTempFeelsLike} °F`
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  document.querySelectorAll(".fahrenheitForecast").forEach(function(el) {el.classList.remove("hidden")});
  document.querySelectorAll(".celsiusForecast").forEach(function(el) {el.classList.add("hidden")});
}
 // F->C
 // show temperature (current and feels like in °C), change style of selected degrees (switch class active)
function changeToCelsius (event) {
  event.preventDefault();
  let currentTemperatureElement = document.querySelector("#current-temperature");
  let currentFeelsLikeElement = document.querySelector("#current-feels-like");
  currentTemperatureElement.innerHTML = currentCelsiusTemp;
  currentFeelsLikeElement.innerHTML = `${currentCelsiusTempFeelsLike} °C`;
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  document.querySelectorAll(".celsiusForecast").forEach(function(el) {el.classList.remove("hidden")});
  document.querySelectorAll(".fahrenheitForecast").forEach(function(el) {el.classList.add("hidden")});
}

//--------------------------------
// global variables:
// celsius temperature - for units conversion
// API key, endpoint and units
let currentCelsiusTemp = null;
let currentCelsiusTempFeelsLike = null;
let units = "metric";
let apiKey = "addf72680d56ebf55846fea13531f597";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
let apiEndpointForecast = "https://api.openweathermap.org/data/2.5/forecast";

// display weather in Prague on load
let defaultCityName = "Prague";
let apiUrl = `${apiEndpoint}?q=${defaultCityName}&appid=${apiKey}&units=${units}`
let apiUrlForecast = `${apiEndpointForecast}?q=${defaultCityName}&appid=${apiKey}&units=${units}`
axios.get(apiUrl).then(showWeather);
axios.get(apiUrlForecast).then(showForecast);

formatDate(Date.now());

// event listeners: buttons and units links
let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", getGeolocationCoords);

let form = document.querySelector("#search-form");
form.addEventListener("submit", getCityWeather);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", changeToFahrenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", changeToCelsius);