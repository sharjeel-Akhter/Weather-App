// =====================
//  CONFIG
// =====================

// 🔑 Replace with your OpenWeatherMap API key
// Get a free key at: https://openweathermap.org/api
const API_KEY = "3468e7ac8482cb41c932076c3e672452";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// =====================
//  DOM ELEMENTS
// =====================
const cityInput   = document.getElementById("cityInput");
const searchBtn   = document.getElementById("searchBtn");
const errorMsg    = document.getElementById("errorMsg");
const loader      = document.getElementById("loader");
const weatherCard = document.getElementById("weatherCard");

// Card fields
const cityName    = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const dateTime    = document.getElementById("dateTime");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity    = document.getElementById("humidity");
const wind        = document.getElementById("wind");
const feelsLike   = document.getElementById("feelsLike");
const visibility  = document.getElementById("visibility");

// =====================
//  EVENT LISTENERS
// =====================
searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

// =====================
//  MAIN HANDLER
// =====================
function handleSearch() {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  fetchWeather(city);
}

// =====================
//  FETCH WEATHER
// =====================
async function fetchWeather(city) {
  showLoader(true);
  clearError();
  hideCard();

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) throw new Error("City not found. Please check the spelling.");
      if (response.status === 401) throw new Error("Invalid API key. Check your configuration.");
      throw new Error("Something went wrong. Please try again.");
    }

    const data = await response.json();
    displayWeather(data);

  } catch (err) {
    showError(err.message);
  } finally {
    showLoader(false);
  }
}

// =====================
//  DISPLAY WEATHER
// =====================
function displayWeather(data) {
  // Location
  cityName.textContent    = data.name;
  countryName.textContent = data.sys.country;

  // Date & Time
  dateTime.innerHTML = getFormattedDate();

  // Icon
  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  // Temperature & description
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;

  // Stats
  humidity.textContent  = `${data.main.humidity}%`;
  wind.textContent      = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  visibility.textContent = data.visibility
    ? `${(data.visibility / 1000).toFixed(1)} km`
    : "N/A";

  showCard();
}

// =====================
//  HELPERS
// =====================
function getFormattedDate() {
  const now = new Date();
  const day  = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return `${day}<br>${date} · ${time}`;
}

function showLoader(state) {
  loader.classList.toggle("active", state);
}

function showCard() {
  weatherCard.classList.add("visible");
}

function hideCard() {
  weatherCard.classList.remove("visible");
}

function showError(msg) {
  errorMsg.textContent = msg;
}

function clearError() {
  errorMsg.textContent = "";
}
