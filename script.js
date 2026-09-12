const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");
const resultDiv = document.querySelector("#result");
const cityName = document.querySelector("#city-name");
const temperature = document.querySelector("#temperature"); // Ou l'ID de ton span de température
const errorMessage = document.querySelector("#error-msg");
const card = document.querySelector(".card");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const city = cityInput.value.trim();
  if (!city) return;

  // Réinitialisation de l'affichage
  if (errorMessage) errorMessage.classList.add("hidden");
  resultDiv.classList.add("hidden");
  card.classList.remove("warm", "cold");

  try {
    // 1. Obtenir les coordonnées géographiques
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Ville introuvable");
    }

    const { latitude, longitude, name } = geoData.results[0];

    // 2. Obtenir la météo
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherResponse.json();

    const tempVal = Math.round(weatherData.current_weather.temperature);

    // 3. Mettre à jour le DOM
    cityName.textContent = name;
    temperature.textContent = tempVal; // Assurez-vous que temperature est défini correctement
    resultDiv.classList.remove("hidden");

    // Changer la couleur selon la température
    if (tempVal >= 20) {
      card.classList.add("warm");
    } else {
      card.classList.add("cold");
    }

  } catch (error) {
    if (errorMessage) {
      errorMessage.textContent = error.message;
      errorMessage.classList.remove("hidden");
    }
  }
});
