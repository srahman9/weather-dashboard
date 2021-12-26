var cities = [];

var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

var formSumbitHandler = function (event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();
  if (city) {
    cityWeather(city);
    fiveDay(city);
    cities.unshift({ city });
    cityInputEl.value = "";
  } else {
    alert("Please enter a City");
  }
  saveSearch();
  pastSearch(city);
};

var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};

var cityWeather = function (city) {
  var apiKey = "f49bda8af803c9e950f1a21a521b8576";
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city);
    });
  });
};

var displayWeather = function (weather, searchCity) {
  //clear old content
  weatherContainerEl.textContent = "";
  citySearchInputEl.textContent = searchCity;

  //create date element
  var currentDate = document.createElement("span");
  currentDate.textContent =
    " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  citySearchInputEl.appendChild(currentDate);

  //create an image element
  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  citySearchInputEl.appendChild(weatherIcon);

  //create a element to show temperature
  var temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
  temperatureEl.classList = "list-group-item";

  //create a element to show Humidity
  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "list-group-item";

  //create a element to show Wind
  var windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  windSpeedEl.classList = "list-group-item";

  weatherContainerEl.appendChild(temperatureEl);
  weatherContainerEl.appendChild(humidityEl);
  weatherContainerEl.appendChild(windSpeedEl);

  var lat = weather.coord.lat;
  var lon = weather.coord.lon;
  uvIndex(lat, lon);
};

var uvIndex = function (lat, lon) {
  var apiKey = "f49bda8af803c9e950f1a21a521b8576";
  var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayUvIndex(data);
    });
  });
};

var displayUvIndex = function (index) {
  var uvIndexEl = document.createElement("div");
  uvIndexEl.textContent = "UV Index: ";
  uvIndexEl.classList = "list-group-item";

  uvIndexValue = document.createElement("span");
  uvIndexValue.textContent = index.value;

  if (index.value <= 2) {
    uvIndexValue.classList = "favorable";
  } else if (index.value > 2 && index.value <= 8) {
    uvIndexValue.classList = "moderate ";
  } else if (index.value > 8) {
    uvIndexValue.classList = "severe";
  }

  uvIndexEl.appendChild(uvIndexValue);

  weatherContainerEl.appendChild(uvIndexEl);
};

//Five day forcast section
var fiveDay = function (city) {
  var apiKey = "f49bda8af803c9e950f1a21a521b8576";
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      display5Day(data);
    });
  });
};

var display5Day = function (weather) {
  forecastContainerEl.textContent = "";
  forecastTitle.textContent = "5-Day Forecast:";

  var forecast = weather.list;
  for (var i = 5; i < forecast.length; i = i + 8) {
    var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-primary text-light m-2";

    //create date element for five day forcast
    var forecastDate = document.createElement("h5");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);

    //create an image element for five day forcast
    var weatherIcon = document.createElement("img");
    weatherIcon.classList = "card-body text-center";
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );

    forecastEl.appendChild(weatherIcon);

    var forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = dailyForecast.main.temp + " °F";

    forecastEl.appendChild(forecastTempEl);

    var forecastHumEl = document.createElement("span");
    forecastHumEl.classList = "card-body text-center";
    forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

    forecastEl.appendChild(forecastHumEl);

    forecastContainerEl.appendChild(forecastEl);
  }
};

var pastSearch = function (pastSearch) {
  pastSearchEl = document.createElement("button");
  pastSearchEl.textContent = pastSearch;
  pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
  pastSearchEl.setAttribute("data-city", pastSearch);
  pastSearchEl.setAttribute("type", "submit");

  pastSearchButtonEl.prepend(pastSearchEl);
};

var pastSearchHandler = function (event) {
  var city = event.target.getAttribute("data-city");
  if (city) {
    cityWeather(city);
    fiveDay(city);
  }
};

cityFormEl.addEventListener("submit", formSumbitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);
