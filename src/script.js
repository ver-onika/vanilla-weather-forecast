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
console.log(response.data.main.temp);
let currentTemp = Math.round(response.data.main.temp);
  let currentFeelsLike = Math.round(response.data.main.feels_like);
  let currentHumidity = response.data.main.humidity;
  let currentPressure = response.data.main.pressure;
  let currentWeatherDescription = (response.data.weather[0]).description;
  let city = response.data.name;
  let country = response.data.sys.country;
  let currentDateTime = response.data.dt*1000

  let tempElement = document.querySelector("#current-temperature");
  let weatherDescriptionElement = document.querySelector("#current-weather-description");
  let feelsLikeElement = document.querySelector("#current-feels-like");
  let humidityElement = document.querySelector("#current-humidity");
  let pressureElement = document.querySelector("#current-pressure");

  let h1City = document.querySelector("h1");
  h1City.innerHTML = `${city}, ${country}` || h1City.innerHTML;

  formatDate(currentDateTime);

  tempElement.innerHTML = currentTemp;
  weatherDescriptionElement.innerHTML = currentWeatherDescription;
  feelsLikeElement.innerHTML = currentFeelsLike;
  humidityElement.innerHTML = currentHumidity;
  pressureElement.innerHTML = currentPressure;
} 

let cityName = "Paris";
let units = "metric";
let apiKey = "addf72680d56ebf55846fea13531f597";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
let apiUrl = `${apiEndpoint}?q=${cityName}&appid=${apiKey}&units=${units}`;

axios.get(apiUrl).then(showWeather);

formatDate(Date.now());